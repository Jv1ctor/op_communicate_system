import prisma from "../database/prisma"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)
const timezoneBrazil = "America/Sao_Paulo"
const NotificationsService = {
  async create(type: "product" | "analyse", id: string) {
    try {
      if (type === "product") {
        const notificationProduct = await prisma.notification_product.upsert({
          where: { id_product: id },
          create: {
            id_product: id,
          },
          update: {},
          select: {
            products: {
              select: {
                status: true,
                reactor: true,
                name_product: true,
                updated_at: true,
                product_id: true,
                fk_reactor: true,
              },
            },
          },
        })

        return {
          ...notificationProduct.products,
          type_notification: "Produto",
          formattingDate: dayjs
            .tz(notificationProduct.products.updated_at, timezoneBrazil)
            .format("HH:mm"),
        }
      }

      if (type === "analyse") {
        const notificationAnalysis = await prisma.notification_analysis.upsert({
          where: { id_analysis: id },
          create: { id_analysis: id },
          update: {},
          select: {
            analysis: {
              select: {
                count: true,
                created_at: true,
                products: {
                  select: {
                    name_product: true,
                    reactor: true,
                    product_id: true,
                    fk_reactor: true,
                  },
                },
              },
            },
          },
        })

        return {
          ...notificationAnalysis.analysis,
          ...notificationAnalysis.analysis.products,
          formattingDate: dayjs
            .tz(notificationAnalysis.analysis.created_at, timezoneBrazil)
            .format("HH:mm"),
          type_notification: "Análise",
        }
      }
    } catch (error) {
      throw new Error("error create notification")
    }
  },

  async listAll() {
    try {
      const notificationProduct = prisma.notification_product.findMany({
        select: {
          products: {
            select: {
              name_product: true,
              status: true,
              reactor: true,
              updated_at: true,
              product_id: true,
              fk_reactor: true,
            },
          },
        },
      })
      const notificationAnalysis = prisma.notification_analysis.findMany({
        select: {
          analysis: {
            select: {
              count: true,
              created_at: true,
              products: {
                select: {
                  name_product: true,
                  reactor: true,
                  product_id: true,
                  fk_reactor: true,
                },
              },
            },
          },
        },
      })

      const [analysis, products] = await Promise.all([
        notificationAnalysis,
        notificationProduct,
      ])

      const formattingProducts = products.map((item) => ({
        ...item.products,
        type_notification: "Produto",
        formattingDate: dayjs.tz(item.products.updated_at, timezoneBrazil).format("HH:mm"),
        time: item.products.updated_at,
      }))
      const formattingAnalysis = analysis.map((item) => ({
        ...item.analysis.products,
        ...item.analysis,
        isAnalyse: true,
        type_notification: "Análise",
        formattingDate: dayjs.tz(item.analysis.created_at, timezoneBrazil).format("HH:mm"),
        time: item.analysis.created_at,
      }))

      return [...formattingProducts, ...formattingAnalysis].sort(
        (item1, item2) => dayjs(item2.time).diff() - dayjs(item1.time).diff(),
      )
    } catch (error) {
      throw new Error("error list notification")
    }
  },

  async deleteNotificationAnalyse(product_id: string) {
    try {
      const notificationAnalyse = await prisma.notification_analysis.deleteMany({
        where: { analysis: { fk_product: product_id } },
      })
      return notificationAnalyse
    } catch (error) {
      throw new Error("error delete notification")
    }
  },
}

export default NotificationsService
