import { Request, Response } from "express"
import prisma from "../database/prisma"
import EventEmitter from "events"

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
          name_product: true,
          quant_produce: true,
          num_op: true,
          turn_supervisor: true,
          num_roadmap: true,
          operator: true,
          num_batch: true,
          turn: true,
          reactor: true,
        },
      })

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
    const reactor = req.params.reactor

    const listProduct = await prisma.products.findMany({
      where: { reactor: reactor },
      select: {
        name_product: true,
        quant_produce: true,
        num_op: true,
        turn_supervisor: true,
        num_roadmap: true,
        operator: true,
        num_batch: true,
        turn: true,
        reactor: true,
      },
    })
    return res
      .status(200)
      .json({ action: { list_product: true }, product_list: listProduct })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const createAnalisys = (req: Request, res: Response) => {}
export const events = (_req: Request, res: Response) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    connection: "keep-alive",
    "cache-control": "no-cache",
  })

  myEmitter.on("create-product", (product: string) => {
    res.write("event: notification\n")
    res.write(`data:${JSON.stringify(product)}\n\n`)
  })
}
