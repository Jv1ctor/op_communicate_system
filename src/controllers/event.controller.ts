import { Request, Response } from "express"
import prisma from "../database/prisma"
import EventEmitter from "events"
import { Analysis, Products } from "@prisma/client"

const myEmitter = new EventEmitter()

interface ProductDataInterface {
  name: string
  qnt: number
  "num-op": number
  "turn-supervisor": string
  "num-roadmap": number
  "name-operator": string
  "num-batch": number
  turn: string
  reactor: string
}

interface NotificationInterface {
  type_notification: "product" | "analysis"
  product_name: string
  reactor_name: string
  created_at: Date
  count?: number
  status?: string
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: ProductDataInterface = req.body
    const userId = res.locals.userId
    const user = await prisma.users.findFirst({
      where: { id: userId },
      select: { user_prod: true },
    })
    const reactor = await prisma.reactors.findUnique({
      where: { name_reactor: productData.reactor },
      select: { id_reactor: true },
    })
    if (user && user.user_prod && reactor) {
      const product = await prisma.products.create({
        data: {
          name_product: productData.name,
          quant_produce: Number(productData.qnt),
          num_op: Number(productData["num-op"]),
          turn_supervisor: productData["turn-supervisor"],
          num_roadmap: Number(productData["num-roadmap"]),
          operator: productData["name-operator"],
          num_batch: Number(productData["num-batch"]),
          turn: productData.turn,
          reactor: productData.reactor,
          fk_user_prod: user.user_prod.fk_id_user_prod,
          fk_reactor: reactor.id_reactor,
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
        product_name: product.name_product,
        reactor_name: product.reactor,
        status: product.status,
        created_at: product.updated_at,
      }
      myEmitter.emit("notification", dataNotification)
      myEmitter.emit("create-product", product)
      return (
        product &&
        res.status(201).json({
          action: { created_product: true },
          message: "successfully created product",
        })
      )
    }
    res.status(400).json({
      action: { created_product: false },
      error: "data when creating the product",
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const listProduct = async (req: Request, res: Response) => {
  try {
    const reactor = req.headers.reactor as string
    const product_status = req.headers.product_status as string
    const productId = req.headers?.product_id as string

    const listProduct = await prisma.products.findMany({
      where: {
        OR: [{ reactor: reactor }, { product_id: productId }],
        AND: { status: product_status },
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
      },
    })

    return res
      .status(200)
      .json({ action: { list_product: true }, product_list: listProduct })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const createAnalysis = async (req: Request, res: Response) => {
  try {
    const analysisData = req.body
    const userId = res.locals.userId

    const user = await prisma.users.findFirst({
      where: { id: userId },
      select: { user_cq: true },
    })

    if (user && user.user_cq) {
      const analyseList = await prisma.analysis.findMany({
        where: { fk_product: analysisData.product_id },
      })

      const analyse = await prisma.analysis.create({
        data: {
          adjustment: analysisData.adjustment,
          fk_product: analysisData.product_id,
          fk_user_cq: user.user_cq.fk_id_user_cq,
          count: analyseList.length + 1,
        },
        select: {
          adjustment: true,
          count: true,
          created_at: true,
          products: { select: { reactor: true, name_product: true } },
        },
      })

      const dataNotification: NotificationInterface = {
        type_notification: "analysis",
        created_at: analyse.created_at,
        product_name: analyse.products.name_product,
        reactor_name: analyse.products.reactor,
        count: analyse.count,
      }

      myEmitter.emit("notification", dataNotification)
      myEmitter.emit("create-analyse", analyse)
      return (
        analyse &&
        res.status(201).json({
          action: { created_analyse: true },
          message: "successfully created analyse",
        })
      )
    }
    res.status(400).json({
      action: { created_product: false },
      error: "data when creating the analyse",
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const listAnalysis = async (req: Request, res: Response) => {
  try {
    const productId = req.headers.product as string

    const listAnalysis = await prisma.analysis.findMany({
      where: { fk_product: productId },
      select: {
        adjustment: true,
        count: true,
        created_at: true,
      },
    })

    return res
      .status(200)
      .json({ action: { list_analysis: true }, analyse_list: listAnalysis })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const finishProduct = async (req: Request, res: Response) => {
  try {
    const { product_id, product_analyst, product_status } = req.body

    if (product_id && product_status) {
      const product = await prisma.products.findUnique({
        where: { product_id: product_id },
        select: {
          status: true,
          analyst_name: true,
        },
      })
      if (product?.status === "andamento") {
        const productFinish = await prisma.products.update({
          where: { product_id: product_id },
          data: {
            status: product_status,
            analyst_name: product_analyst,
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

        const dataNotification: NotificationInterface = {
          type_notification: "product",
          created_at: productFinish.updated_at,
          product_name: productFinish.name_product,
          reactor_name: productFinish.reactor,
          status: productFinish.status,
        }

        myEmitter.emit("notification", dataNotification)
        myEmitter.emit("finish-product", productFinish)
        return res.status(200).json({
          action: { finish_product: true },
          message: "successfully finish product",
        })
      }
      res.status(400).json({
        action: { finish_product: true },
        error: "error when finalizing the product",
      })
    }
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

const listProductCallback = async () => {
  const listProduct = await prisma.products.findMany({
    select: { name_product: true, reactor: true, updated_at: true, status: true },
  })

  if (listProduct.length > 0) {
    listProduct.forEach((product) => {
      const dataNotification: NotificationInterface = {
        type_notification: "product",
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
      products: { select: { reactor: true, name_product: true } },
    },
  })

  if (listAnalyse.length > 0) {
    listAnalyse.forEach((analyse) => {
      const dataNotification: NotificationInterface = {
        type_notification: "analysis",
        product_name: analyse.products.name_product,
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
