import prisma from "../database/prisma"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)
const timezoneBrazil = "America/Sao_Paulo"
const AnalyseService = {
  async listAllOfProduct(productId: string, reactorId: string) {
    try {
      const listAnalysis = await prisma.analysis.findMany({
        where: { fk_product: productId, products: { fk_reactor: reactorId } },
        select: { adjustment: true, count: true, created_at: true },
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

}

export default AnalyseService
