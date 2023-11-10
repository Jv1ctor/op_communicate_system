import prisma from "../database/prisma"

export interface ReactorCreateData {
  name_reactor: string
  user_id: string
}

const ReactorService = {
  async create(data: ReactorCreateData) {
    try {
      if (data.name_reactor) {
        const existReactor = await prisma.reactors.findUnique({
          where: { name_reactor: data.name_reactor },
        })

        const reactor =
          !existReactor &&
          (await prisma.reactors.create({
            data: {
              name_reactor: data.name_reactor,
              fk_user_adm: data.user_id,
            },
          }))

        if (reactor) {
          return {
            name_reactor: reactor.name_reactor,
          }
        }
      }
    } catch (err) {
      throw new Error("create reactor error")
    }
  },

  async list() {
    try {
      const reactors = prisma.reactors.findMany({ select: { name_reactor: true } })
      return reactors
    } catch (err) {
      throw new Error("list reactors error")
    }
  },
}

export default ReactorService
