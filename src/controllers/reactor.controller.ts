import { Request, Response } from "express"
import ReactorService from "../services/reactor.service"

export const listReactors = async (req: Request, res: Response) => {
  try {
    const user = req.signedCookies.user
    const reactors = await ReactorService.list()

    res.render("pages/reactor", {
      reactor_list: reactors,
      user,
    })
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}
