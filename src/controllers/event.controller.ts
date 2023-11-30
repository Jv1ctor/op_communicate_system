import { Request, Response } from "express"
import prisma from "../database/prisma"
import EventEmitter from "events"
import { Analysis, Products } from "@prisma/client"
import ProductService from "../services/product.service"
import UserService from "../services/user.service"
import AnalyseService from "../services/analyse.service"

const myEmitter = new EventEmitter()

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

interface NotificationInterface {
  type_notification: "product" | "analysis"
  product_id: string
  product_name: string
  reactor_name: string
  created_at: Date
  count?: number
  status?: string
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
          select: { products: { where: { fk_reactor: reactorId, status: "andamento" } } },
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
      const dataNotification: NotificationInterface = {
        type_notification: "product",
        product_id: product.product_id,
        product_name: product.name_product,
        reactor_name: product.reactor,
        status: product.status,
        created_at: product.updated_at,
      }
      myEmitter.emit("notification", dataNotification)
      myEmitter.emit("create-product", product)
      return product && res.status(201).redirect(`/reator/${reactorId}`)
    }
    res.sendStatus(400)
    // res.status(400).json({
    //   action: { created_product: false },
    //   error: "data when creating the product",
    // })
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}

export const listProducts = async (req: Request, res: Response) => {
  try {
    const user = req.signedCookies.user
    const reactorId = req.params.id

    const productData = await ProductService.listAllOfReactor(reactorId)
    res.render("pages/product", {
      listProduct: {
        process: productData?.listProductProcess,
        approved: productData?.listProductApproved,
        disapproved: productData?.listProductDisapproved,
      },
      user,
      reactor: productData.reactor,
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
            adjustment: true,
            count: true,
            created_at: true,
            products: {
              select: {
                reactor: true,
                name_product: true,
                product_id: true,
                status: true,
              },
            },
          },
        })

        // const dataNotification: NotificationInterface = {
        //   type_notification: "analysis",
        //   product_id: analyse.products.product_id,
        //   created_at: analyse.created_at,
        //   status: analyse.products.status,
        //   product_name: analyse.products.name_product,
        //   reactor_name: analyse.products.reactor,
        //   count: analyse.count,
        // }

        // myEmitter.emit("notification", dataNotification)
        // myEmitter.emit("create-analyse", analyse)
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
    const productData = ProductService.listProductById(productId)
    const analyseData = AnalyseService.listAllOfProduct(productId, reactorId)

    const [product, analysis] = await Promise.all([productData, analyseData])

    res.render("pages/analysis", {
      analysis: analysis?.list,
      product: product?.product,
      user,
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

        // const dataNotification: NotificationInterface = {
        //   type_notification: "product",
        //   created_at: productFinish.updated_at,
        //   product_id: productFinish.product_id,
        //   product_name: productFinish.name_product,
        //   reactor_name: productFinish.reactor,
        //   status: productFinish.status,
        // }

        // myEmitter.emit("notification", dataNotification)
        // myEmitter.emit("finish-product", productFinish)
        return (
          productFinish &&
          res.status(200).redirect(`/reator/produto/${reactorId}.${productId}`)
        )
      }
      res.send(403)
    }
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}

const listProductCallback = async () => {
  const listProduct = await prisma.products.findMany({
    select: {
      name_product: true,
      reactor: true,
      updated_at: true,
      status: true,
      product_id: true,
    },
  })

  if (listProduct.length > 0) {
    listProduct.forEach((product) => {
      const dataNotification: NotificationInterface = {
        type_notification: "product",
        product_id: product.product_id,
        product_name: product.name_product,
        reactor_name: product.reactor,
        created_at: product.updated_at,
        status: product.status,
      }

      myEmitter.emit("notification", dataNotification)
    })
  }
}

const listAnalyseCallback = async () => {
  const listAnalyse = await prisma.analysis.findMany({
    select: {
      created_at: true,
      adjustment: true,
      count: true,
      products: {
        select: { reactor: true, name_product: true, product_id: true, status: true },
      },
    },
  })

  if (listAnalyse.length > 0) {
    listAnalyse.forEach((analyse) => {
      const dataNotification: NotificationInterface = {
        type_notification: "analysis",
        product_id: analyse.products.product_id,
        product_name: analyse.products.name_product,
        status: analyse.products.status,
        reactor_name: analyse.products.reactor,
        created_at: analyse.created_at,
        count: analyse.count,
      }

      myEmitter.emit("notification", dataNotification)
    })
  }
}

export const events = async (_req: Request, res: Response) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    connection: "keep-alive",
    "cache-control": "no-cache",
  })

  myEmitter.on("notification", (data: NotificationInterface) => {
    res.write("event: notification\n")
    res.write(`data:${JSON.stringify(data)}\n\n`)
  })
  myEmitter.on("create-product", (product: Products) => {
    res.write("event: create-product\n")
    res.write(`data:${JSON.stringify(product)}\n\n`)
  })
  myEmitter.on("create-analyse", (analyse: Analysis) => {
    res.write("event: create-analyse\n")
    res.write(`data:${JSON.stringify(analyse)}\n\n`)
  })
  myEmitter.on("finish-product", (product: Products) => {
    res.write("event: finish-product\n")
    res.write(`data:${JSON.stringify(product)}\n\n`)
  })

  listProductCallback()
  listAnalyseCallback()
}
