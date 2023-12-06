import { randomUUID } from "crypto"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
dayjs.extend(timezone)
const timezoneBrazil = "America/Sao_Paulo"

export type NotificationType = {
  notification_id: string
  product_id: string
  name_product: string
  reactor: string
  reactor_id: string
  status?: string
  count?: number
  isAnalyse?: boolean
  isConcluded: boolean
  type_notification: "Produto" | "Análise"
  formattingDate: string
  timestamp: Date
}

type ProductDataType = {
  product_id: string
  name_product: string
  quant_produce: number
  reactor: string
  operator: string
  num_op: number
  num_batch: number
  num_roadmap: number
  turn_supervisor: string
  turn: string
  status: string
  created_at: Date
  updated_at: Date
  fk_reactor: string
}

type AnalysisDataType = {
  products: {
    product_id: string
    name_product: string
    reactor: string
    status: string
    fk_reactor: string
  }
  created_at: Date
  analysis_id: string
  adjustment: string
  count: number
  fk_product: string
}

export const notificationsCache = new Map()

const NotificationsService = {
  async createNotificationProduct(data: ProductDataType, userId: string) {
    if (data && userId) {
      const formattingDate = dayjs
        .tz(data.updated_at, timezoneBrazil)
        .format("HH:mm")
      const notificationData: NotificationType = {
        notification_id: randomUUID(),
        product_id: data.product_id,
        name_product: data.name_product, 
        reactor: data.reactor,
        reactor_id: data.fk_reactor,
        status: data.status,
        type_notification: "Produto",
        formattingDate: formattingDate,
        isConcluded: data.status !== "andamento",
        timestamp: data.updated_at,
      }

      const Mapkey = `${notificationData.notification_id}.${userId}`
      notificationsCache.set(Mapkey, notificationData)
      return notificationData
    }
  },

  async createNotificationAnalysis(data: AnalysisDataType, userId: string) {
    if (data && userId) {
      const formattingDate = dayjs
        .tz(data.created_at, timezoneBrazil)
        .format("HH:mm")
      const notificationData: NotificationType = {
        notification_id: randomUUID(),
        product_id: data.products.product_id,
        name_product: data.products.name_product,
        isConcluded: false,
        reactor: data.products.reactor,
        reactor_id: data.products.fk_reactor,
        type_notification: "Análise",
        formattingDate: formattingDate,
        timestamp: data.created_at,
        count: data.count,
        isAnalyse: true,
      }

    
      const Mapkey = `${notificationData.notification_id}.${userId}`
      notificationsCache.set(Mapkey, notificationData)
      return notificationData
    }
  },

  async listAll(userId: string) {
    const notificationArr: [string, NotificationType][] = [
      ...notificationsCache,
    ]
    const notifications = notificationArr.reduce(
      (acc: NotificationType[], notification) => {
        const [key, data] = notification
        const [_, userIdNotification] = key.split(".")

        if (userIdNotification === userId) {
          acc.push(data)
        }
        return acc
      },
      []
    )
    return notifications.sort(
      (item1, item2) =>
        dayjs(item2.timestamp).diff() - dayjs(item1.timestamp).diff()
    )
  },

  async deleteNotificationAnalyse(product_id: string) {
    notificationsCache.forEach((notification, key) => {
      const isNotification =
        notification.product_id === product_id && notification.type_notification === "Análise"
      if (isNotification) {
        notificationsCache.delete(key)
      }
    })
  },

  async deleteNotificationById(notificationId: string, userId: string) {
    notificationsCache.delete(`${notificationId}.${userId}`)
  },

  async deleteNotificationByProductId(product_id: string, status: "andamento") {
    notificationsCache.forEach((notification, key) => {
      const isNotification =
        notification.product_id === product_id && notification.status === status
      if (isNotification) {
        notificationsCache.delete(key)
      }
    })
  },
}

export default NotificationsService
