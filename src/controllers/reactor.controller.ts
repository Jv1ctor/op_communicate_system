import { Request, Response } from "express"
import ReactorService, { ReactorCreateData } from "../services/reactor.service"

export const createReactors = async (req: Request, res: Response) => {
  try {
    const reactorName = req.body.name_reactor
    const userId = res.locals.userId
    if (reactorName) {
      const dataCreateReactor: ReactorCreateData = {
        name_reactor: reactorName,
        user_id: userId,
      }
      const reactor = await ReactorService.create(dataCreateReactor)

      if (reactor) {
        return res.status(201).json({
          action: { reactors_created: true },
          message: "created reactor success",
          reactor: reactor.name_reactor,
        })
      }
      return res.status(400).json({
        action: { reactors_created: false },
        error: "reactor already exists",
      })
    }
    res.status(400).json({
      action: { reactors_created: false },
      error: "values not found",
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}

export const listReactors = async (_req: Request, res: Response) => {
  try {
    const reactors = await ReactorService.list()
    return res.status(200).json({ action: { list_reactors: true }, reactors })
  } catch (err) {
    res.status(500).json({ error: "internal server error" })
  }
}
