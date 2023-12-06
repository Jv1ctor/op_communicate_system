import { Request, Response } from "express"
import prisma from "../database/prisma"
import EventEmitter from "events"
import { Analysis, Products } from "@prisma/client"
import ProductService from "../services/product.service"
import AnalyseService from "../services/analyse.service"
import NotificationsService, {
  NotificationType,
  notificationsCache,
} from "../services/notifications.service"

const myEmitter = new EventEmitter()

myEmitter.setMaxListeners(10)

interface ProductDataInterface {
  name_product: string
  qnt_product: number
  num_op: number
  turn_supervisor: string
  num_roadmap: number
  name_operator: string
  num_batch: number
  turn: string
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: ProductDataInterface = req.body
    const reactorId = req.params.id
    const userId = res.locals.userId
    const user = await prisma.users.findFirst({
      where: { id: userId },
      select: { user_prod: true },
    })

    const reactor = await prisma.reactors.findFirst({
      where: { id_reactor: reactorId },
      include: {
        _count: {
          select: {
            products: { where: { fk_reactor: reactorId, status: "andamento" } },
          },
        },
      },
    })

    if (user && user.user_prod && reactor && reactor._count.products === 0) {
      const product = await prisma.products.create({
        data: {
          name_product: productData.name_product,
          quant_produce: Number(productData.qnt_product),
          num_op: Number(productData.num_op),
          turn_supervisor: productData.turn_supervisor,
          num_roadmap: Number(productData.num_roadmap),
          operator: productData.name_operator,
          num_batch: Number(productData.num_batch),
          turn: productData.turn,
          reactor: reactor.name_reactor,
          fk_user_prod: user.user_prod.fk_id_user_prod,
          fk_reactor: reactorId,
        },
        select: {
          product_id: true,
          fk_reactor: true,
          name_product: true,
          quant_produce: true,
          num_op: true,
          turn_supervisor: true,
          num_roadmap: true,
          operator: true,
          num_batch: true,
          turn: true,
          status: true,
          reactor: true,
          created_at: true,
          updated_at: true,
        },
      })
      const notificationsProduct = await NotificationsService.createNotificationProduct(
        product,
        userId,
      )
      myEmitter.emit("notification", notificationsProduct)
      myEmitter.emit("create-product", product)
      return product && res.status(201).redirect(`/reator/${reactorId}`)
    }
    res.sendStatus(400)
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}

export const listProducts = async (req: Request, res: Response) => {
  try {
    const user = req.signedCookies.user
    const reactorId = req.params.id
    const userId = res.locals.userId
    const productData = ProductService.listAllOfReactor(reactorId)
    const notification = NotificationsService.listAll(userId)

    const [listNotification, products] = await Promise.all([notification, productData])
    res
      .cookie("last_page", req.originalUrl, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        signed: true,
      })
      .render("pages/product", {
        listProduct: {
          process: products?.listProductProcess,
          approved: products?.listProductApproved,
          disapproved: products?.listProductDisapproved,
        },
        notification: listNotification,
        first_notification: listNotification[0],
        user,
        reactor: products.reactor,
        isProductUser: user.type !== "Produção",
      })
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}

export const createAnalysis = async (req: Request, res: Response) => {
  try {
    const analysisData = req.body
    const userId = res.locals.userId
    const productId = req.params.productId
    const reactorId = req.params.reactorId
    const user = await prisma.users.findFirst({
      where: { id: userId },
      select: { user_cq: true },
    })

    if (user && user.user_cq) {
      const analyseList = await prisma.analysis.findMany({
        where: { fk_product: productId },
      })

      const product = await prisma.products.findUnique({
        where: { product_id: productId },
        select: { status: true },
      })

      if (product?.status === "andamento") {
        const analyse = await prisma.analysis.create({
          data: {
            adjustment: analysisData.adjustments,
            fk_product: productId,
            fk_user_cq: user.user_cq.fk_id_user_cq,
            count: analyseList.length + 1,
          },
          select: {
            fk_product: true,
            adjustment: true,
            count: true,
            analysis_id: true,
            created_at: true,
            products: {
              select: {
                reactor: true,
                name_product: true,
                product_id: true,
                status: true,
                fk_reactor: true,
              },
            },
          },
        })
        const notificationAnalysis =
          await NotificationsService.createNotificationAnalysis(analyse, userId)

        myEmitter.emit("notification", notificationAnalysis)
        myEmitter.emit("create-analyse", analyse)
        return (
          analyse && res.status(201).redirect(`/reator/produto/${reactorId}.${productId}`)
        )
      }

      return res.sendStatus(403)
    }
    res.sendStatus(400)
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}

export const listAnalysis = async (req: Request, res: Response) => {
  try {
    const user = req.signedCookies.user
    const productId = req.params.productId
    const reactorId = req.params.reactorId
    const userId = res.locals.userId
    const productData = ProductService.listProductById(productId)
    const analyseData = AnalyseService.listAllOfProduct(productId, reactorId)
    const notification = NotificationsService.listAll(userId)
    const [product, analysis, listNotification] = await Promise.all([
      productData,
      analyseData,
      notification,
    ])

    res
      .cookie("last_page", req.originalUrl, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        signed: true,
      })
      .render("pages/analysis", {
        analysis: analysis?.list,
        product: product?.product,
        user,
        notification: listNotification,
        first_notification: listNotification[0],
        reactorId: product?.reactorId,
        isAnalystUser: user.type !== "Controle Qualidade",
      })
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}

export const finishProduct = async (req: Request, res: Response) => {
  try {
    const reactorId = req.params.reactorId
    const productId = req.params.productId
    const finishedData = req.body
    const userId = res.locals.userId

    if (productId && finishedData.status) {
      const product = await prisma.products.findUnique({
        where: { product_id: productId },
        select: {
          status: true,
          analyst_name: true,
        },
      })

      if (product?.status === "andamento") {
        const productFinish = await prisma.products.update({
          where: { product_id: productId },
          data: {
            status: finishedData.status,
            analyst_name: finishedData.name_analyst,
            updated_at: new Date(),
          },
          select: {
            product_id: true,
            fk_reactor: true,
            name_product: true,
            quant_produce: true,
            num_op: true,
            turn_supervisor: true,
            num_roadmap: true,
            operator: true,
            num_batch: true,
            turn: true,
            status: true,
            reactor: true,
            created_at: true,
            updated_at: true,
          },
        })

        await NotificationsService.deleteNotificationAnalyse(productFinish.product_id)
        await NotificationsService.deleteNotificationByProductId(productFinish.product_id, "andamento")
        const notificatioFinish = await NotificationsService.createNotificationProduct(productFinish, userId)

        myEmitter.emit("notification", notificatioFinish, notificatioFinish?.status)
        myEmitter.emit("finish-product", productFinish)
        return (
          productFinish &&
          res.status(200).redirect(`/reator/produto/${reactorId}.${productId}`)
        )
      }
      res.sendStatus(403)
    }
  } catch (err) {
    console.log(err)
    res.status(500).render("pages/500", { err })
  }
}

export const deleteNotification = async (req: Request, res: Response) => {
  const userId = res.locals.userId
  const notificationId = req.params.notificationId
  const lastPage = req.signedCookies.last_page
  await NotificationsService.deleteNotificationById(notificationId, userId)

  res.redirect(lastPage)
}

// const isThereProductProgress = async (userId: string) => {
//   try {
//     const product = await prisma.products.findMany({})
//     if (product.length > 0) {
//       product.forEach(async (productItem) => {
//         const notificationData = await NotificationsService.createNotificationProduct(
//           productItem,
//           userId,
//         )
//         myEmitter.emit("notification", notificationData)
//       })
//       return true
//     } 
//     return false
//   } catch (error) {}
// }

// const isThereAnalysis = async (userId: string) => {
//   try {
//     const analysis = await prisma.analysis.findMany({
//       where: { products: { status: "andamento" } },
//       select: {
//         fk_product: true,
//         adjustment: true,
//         count: true,
//         analysis_id: true,
//         created_at: true,
//         products: {
//           select: {
//             reactor: true,
//             name_product: true,
//             product_id: true,
//             status: true,
//             fk_reactor: true,
//           },
//         },
//       },
//     })
//     if (analysis.length > 0) {
//       analysis.forEach(async (analyseItem) => {
//         const notificationData = await NotificationsService.createNotificationAnalysis(
//           analyseItem,
//           userId,
//         )
//         myEmitter.emit("notification", notificationData)

//         return true 
//       })
//     }
//     return false
//   } catch (error) {}
// }
export const events = async (_req: Request, res: Response) => {
  const userId = res.locals.userId
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    connection: "keep-alive",
    "cache-control": "no-cache",
  })

  const eventNotification = async (data: NotificationType) => {
    notificationsCache.set(`${data.notification_id}.${userId}`, data)
    const list = await NotificationsService.listAll(userId)
    res.write("event: notification\n")
    res.write(`data:${JSON.stringify(list)}\n\n`)
  }

  const eventAnalyse = (analyse: Analysis) => {
    res.write("event: create-analyse\n")
    res.write(`data:${JSON.stringify(analyse)}\n\n`)
  }

  const eventProduct = (product: Products) => {
    res.write("event: create-product\n")
    res.write(`data:${JSON.stringify(product)}\n\n`)
  }

  const eventFinishProduct = (product: Products) => {
    res.write("event: finish-product\n")
    res.write(`data:${JSON.stringify(product)}\n\n`)
  }

  myEmitter.on("notification", eventNotification)
  myEmitter.on("create-product", eventProduct)
  myEmitter.on("create-analyse", eventAnalyse)
  myEmitter.on("finish-product", eventFinishProduct)

  res.on("close", () => {
    myEmitter.off("notification", eventNotification)
    myEmitter.off("create-product", eventProduct)
    myEmitter.off("create-analyse", eventAnalyse)
    myEmitter.off("finish-product", eventFinishProduct)
  })

  // isThereProductProgress(userId)
  // isThereAnalysis(userId)
}
