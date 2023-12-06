import { Request, Response } from "express"
import ProductService from "../services/product.service"
import NotificationsService from "../services/notifications.service"
import { myEmitter } from "./event.controller"

export const listProducts = async (req: Request, res: Response) => {
  try {
    const user = req.signedCookies.user
    const reactorId = req.params.id
    const userId = res.locals.userId
    const productData = ProductService.listAllOfReactor(reactorId)
    const notification = NotificationsService.listAll(userId)

    const [listNotification, products] = await Promise.all([
      notification,
      productData,
    ])
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

export const createProduct = async (req: Request, res: Response) => {
  try {
    const dataCreateProduct = req.body
    const reactorId = req.params.id
    const userId = res.locals.userId
    const productData = {
      ...dataCreateProduct,
      reactorId,
      userId,
    }
    const product = await ProductService.createProduct(productData)
    if (product) {
      const notificationsProduct =
        await NotificationsService.createNotificationProduct(product, userId)
      myEmitter.emit("notification", notificationsProduct)
      myEmitter.emit("create-product", product)
      return product && res.status(201).redirect(`/reator/${reactorId}`)
    }
    res.sendStatus(400)
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}

export const finishProduct = async (req: Request, res: Response) => {
  try {
    const dataFinishProduct = req.body
    const reactorId = req.params.reactorId
    const productId = req.params.productId
    const userId = res.locals.userId

    const finishData = {
      ...dataFinishProduct,
      reactorId,
      productId,
      userId,
    }

    const productFinish = await ProductService.finishedProduct(finishData)
    if (productFinish) {
      await NotificationsService.deleteNotificationAnalyse(
        productFinish.product_id
      )
      await NotificationsService.deleteNotificationByProductId(
        productFinish.product_id,
        "andamento"
      )
      const notificatioFinish =
        await NotificationsService.createNotificationProduct(
          productFinish,
          userId
        )

      myEmitter.emit(
        "notification",
        notificatioFinish,
        notificatioFinish?.status
      )
      myEmitter.emit("finish-product", productFinish)
      return (
        productFinish &&
        res.status(200).redirect(`/reator/produto/${reactorId}.${productId}`)
      )
    }
    res.sendStatus(403)
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}
