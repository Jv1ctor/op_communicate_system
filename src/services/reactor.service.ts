import prisma from "../database/prisma"

const ReactorService = {
  async list() {
    try {
      const reactors = await prisma.reactors.findMany({
        select: { name_reactor: true, id_reactor: true , products: { select: { status: true }}},
      })
      const reactorsFormattingName = reactors.map((item) => {
        const formattingName = item.name_reactor.replace("R", " ")
        return {
          name_reactor: formattingName,
          id_reactor: item.id_reactor,
          existProductProgress: item.products.find( product => product.status === "andamento")
        }
      })
      return reactorsFormattingName
    } catch (err) {
      throw new Error("list reactors error")
    }
  },
}

export default ReactorService
