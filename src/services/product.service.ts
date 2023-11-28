import prisma from "../database/prisma"
import dayjs from "dayjs"

const ProductService = {
  async list(reactorId: string) {
    try {
      const reactorPromise = prisma.reactors.findUnique({
        where: { id_reactor: reactorId },
        select: { name_reactor: true },
      })

      const listProductPromise = prisma.products.findMany({
        where: {
          fk_reactor: reactorId,
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

      const [reactor, listProduct] = await Promise.all([
        reactorPromise,
        listProductPromise,
      ])

      const formattintNameReactor = reactor?.name_reactor.replace("R", "")

      if (listProduct.length > 0) {
        const listProductFomatting = listProduct
          .map((item) => ({
            ...item,
            formattingDate: dayjs(item.updated_at).format("DD/MM-HH:mm"),
          }))
          .sort(
            (item1, item2) =>
              dayjs(item2.updated_at).diff() - dayjs(item1.updated_at).diff(),
          )

        const listProductProcess = listProductFomatting.filter(
          (item) => item.status === "andamento",
        )
        const listProductApproved = listProductFomatting.filter(
          (item) => item.status === "aprovado",
        )
        const listProductDisapproved = listProductFomatting.filter(
          (item) => item.status === "reprovado",
        )

        return {
          listProductProcess,
          listProductApproved,
          listProductDisapproved,
          reactor: formattintNameReactor,
        }
      }

      return { reactor: formattintNameReactor }
    } catch (err) {
      throw new Error("list product error")
    }
  },
}

export default ProductService
