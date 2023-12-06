import { Request, Response } from "express"
import EventEmitter from "events"
import { Analysis, Products } from "@prisma/client"
import NotificationsService, {
  NotificationType,
  notificationsCache,
} from "../services/notifications.service"

export const myEmitter = new EventEmitter()

myEmitter.setMaxListeners(10)

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
