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
          reactor: true,
          created_at: true,
        },
      })

      const dataNotification: NotificationInterface = {
        type_notification: "product",
        product_name: product.name_product,
        reactor_name: product.reactor,
        created_at: product.created_at,
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

    const listProduct = await prisma.products.findMany({
      where: { reactor: reactor },
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
      const analyse = await prisma.analysis.create({
        data: {
          adjustment: analysisData.adjustment,
          fk_product: analysisData.product_id,
          fk_user_cq: user.user_cq.fk_id_user_cq,
        },
        select: {
          adjustment: true,
          created_at: true,
          products: { select: { reactor: true, name_product: true } },
        },
      })

      const dataNotification: NotificationInterface = {
        type_notification: "analysis",
        created_at: analyse.created_at,
        product_name: analyse.products.name_product,
        reactor_name: analyse.products.reactor,
      }

      myEmitter.emit("notification", dataNotification)
      myEmitter.emit("created-analyse", analyse)
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

const listProductCallback = async () => {
  const listProduct = await prisma.products.findMany({
    select: { name_product: true, reactor: true, created_at: true },
  })

  if (listProduct.length > 0) {
    listProduct.forEach((product) => {
      const dataNotification: NotificationInterface = {
        type_notification: "product",
        product_name: product.name_product,
        reactor_name: product.reactor,
        created_at: product.created_at,
      }

      myEmitter.emit("notification", dataNotification)
    })
  }
}

const listAnalyseCallback = async () => {
  const listAnalyse = await prisma.analysis.findMany({
    select: {
      created_at: true,
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
  myEmitter.on("created-analyse", (analyse: Analysis) => {
    res.write("event: create-product\n")
    res.write(`data:${JSON.stringify(analyse)}\n\n`)
  })

  listProductCallback()
  listAnalyseCallback()
}
