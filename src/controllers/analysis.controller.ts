import { Request, Response } from "express"
import prisma from "../database/prisma"
import AnalyseService from "../services/analyse.service"
import ProductService from "../services/product.service"
import NotificationsService from "../services/notifications.service"
import { myEmitter } from "./event.controller"



export const createAnalysis = async (req: Request, res: Response) => {
  try {
    const analysisCreateData = req.body
    const userId = res.locals.userId
    const productId = req.params.productId
    const reactorId = req.params.reactorId
    
    const analysisData = {
      ...analysisCreateData,
      userId,
      productId,
      reactorId
    }

    const analyse = await AnalyseService.createAnalyse(analysisData)

    if(analyse === 403){
      return res.sendStatus(403)
    }

    if(analyse){
      const notificationAnalysis =
        await NotificationsService.createNotificationAnalysis(analyse, userId)

      myEmitter.emit("notification", notificationAnalysis)
      myEmitter.emit("create-analyse", analyse)
      return (
        analyse && res.status(201).redirect(`/reator/produto/${reactorId}.${productId}`)
      )
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