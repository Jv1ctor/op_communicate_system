import prisma from "../database/prisma"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)
const timezoneBrazil = "America/Sao_Paulo"

interface AnalysisDataInterface {
  adjustments: string
  checked: boolean
  userId: string
  productId: string
  reactorId: string
}

const AnalyseService = {
  async listAllOfProduct(productId: string, reactorId: string) {
    try {
      const listAnalysis = await prisma.analysis.findMany({
        where: { fk_product: productId, products: { fk_reactor: reactorId } },
        select: {
          adjustment: true,
          count: true,
          checked: true,
          created_at: true,
          analysis_id: true,
        },
        orderBy: { count: "asc" },
      })

      if (listAnalysis) {
        const formattingListAnalysis = listAnalysis.map((item) => {
          const formattingDate = dayjs.tz(item.created_at, timezoneBrazil).format("HH:mm")
          return {
            ...item,
            formattingDate,
          }
        })
        return { list: formattingListAnalysis }
      }
    } catch (err) {
      throw new Error("error list analyse")
    }
  },

  async createAnalyse(analysisData: AnalysisDataInterface) {
    try {
      const user = await prisma.users.findFirst({
        where: { id: analysisData.userId },
        select: { user_cq: true },
      })

      if (user && user.user_cq) {
        const analyseList = await prisma.analysis.count({
          where: { fk_product: analysisData.productId },
        })

        const product = await prisma.products.findUnique({
          where: { product_id: analysisData.productId },
          select: { status: true },
        })

        if (product?.status === "andamento") {
          const analyse = prisma.analysis.create({
            data: {
              adjustment: analysisData.adjustments,
              fk_product: analysisData.productId,
              fk_user_cq: user.user_cq.fk_id_user_cq,
              count: analyseList + 1,
            },
            select: {
              fk_product: true,
              adjustment: true,
              checked: true,
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

          return analyse
        }
        return 403
      }
    } catch (err) {
      throw new Error("error create analyse")
    }
  },

  async checkedAnalysis(analysisId: string) {
    try {
      const analyse = await prisma.analysis.findUnique({ where: { analysis_id: analysisId}, select: { products: { select: { status: true }}}})

      if (analyse && analyse.products.status === "andamento"){
        const analyseUpdate = await prisma.analysis.update({
          where: { analysis_id: analysisId },
          data: { checked: true },
          select: {
            checked: true,
            products: { select: { product_id: true, fk_reactor: true } },
          },
        })

        return {
          isChecked: analyseUpdate.checked,
          reactor_id: analyseUpdate.products.fk_reactor,
          product_id: analyseUpdate.products.product_id,
        }
      }
    } catch (error) {
      throw new Error("error in checked analyse")
    }
  },
}

export default AnalyseService
