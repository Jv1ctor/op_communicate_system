import prisma from "../database/prisma"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)
const timezoneBrazil = "America/Sao_Paulo"

interface ProductDataInterface {
  name_product: string
  qnt_product: number
  num_op: number
  turn_supervisor: string
  num_roadmap: number
  name_operator: string
  num_batch: number
  turn: string
  userId: string
  reactorId: string
}

interface FinishedDataInterface{
  status: string,
  name_analyst: string,
  reactorId: string
  productId: string
  userId: string
}

const ProductService = {
  async listAllOfReactor(reactorId: string) {
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
            formattingDate: dayjs
              .tz(item.updated_at, timezoneBrazil)
              .format("DD/MM-HH:mm"),
          }))
          .sort(
            (item1, item2) =>
              dayjs(item2.updated_at).diff() - dayjs(item1.updated_at).diff()
          )

        const listProductProcess = listProductFomatting.filter(
          (item) => item.status === "andamento"
        )
        const listProductApproved = listProductFomatting.filter(
          (item) => item.status === "aprovado"
        )
        const listProductDisapproved = listProductFomatting.filter(
          (item) => item.status === "reprovado"
        )

        return {
          listProductProcess,
          listProductApproved,
          listProductDisapproved,
          reactor: {
            id: reactorId,
            name: formattintNameReactor,
          },
        }
      }

      return {
        reactor: {
          id: reactorId,
          name: formattintNameReactor,
        },
      }
    } catch (err) {
      throw new Error("list product error")
    }
  },


  async listProductById(productId: string) {
    try {
      const product = await prisma.products.findUnique({
        where: { product_id: productId },
      })

      if (product) {
        const productFomatting = {
          ...product,
          formattingDate: dayjs
            .tz(product.updated_at, timezoneBrazil)
            .format("DD/MM/YYYY"),
        }

        return {
          product: productFomatting,
          reactorId: product.fk_reactor,
        }
      }
    } catch (err) {
      throw new Error("list product error")
    }
  },


  async createProduct(productData: ProductDataInterface) {
    try {
      const user = await prisma.users.findFirst({
        where: { id: productData.userId },
        select: { user_prod: true },
      })

      const reactor = await prisma.reactors.findFirst({
        where: { id_reactor: productData.reactorId },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  fk_reactor: productData.reactorId,
                  status: "andamento",
                },
              },
            },
          },
        },
      })

      if (user && user.user_prod && reactor && reactor._count.products === 0) {
        const product = prisma.products.create({
          data: {
            name_product: productData.name_product,
            quant_produce: Number(productData.qnt_product),
            num_op: Number(productData.num_op),
            turn_supervisor: productData.turn_supervisor,
            num_roadmap: Number(productData.num_roadmap),
            operator: productData.name_operator,
            num_batch: Number(productData.num_batch),
            turn: productData.turn,
            reactor: reactor.name_reactor,
            fk_user_prod: user.user_prod.fk_id_user_prod,
            fk_reactor: productData.reactorId,
          },
          select: {
            product_id: true,
            fk_reactor: true,
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

        return product
      }
    } catch (err) {
      throw new Error("create product error")
    }
  },


  async finishedProduct(finishedData: FinishedDataInterface){
    try {
      if (finishedData.productId && finishedData.status) {
        const product = await prisma.products.findUnique({
          where: { product_id: finishedData.productId },
          select: {
            status: true,
            analyst_name: true,
          },
        })
  
        if (product?.status === "andamento") {
          const productFinish = prisma.products.update({
            where: { product_id: finishedData.productId },
            data: {
              status: finishedData.status,
              analyst_name: finishedData.name_analyst,
              updated_at: new Date(),
            },
            select: {
              product_id: true,
              fk_reactor: true,
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
  
          return productFinish
        }
      }
    } catch (err) {
      throw new Error("finished product error")
    }
  }   
}

export default ProductService
