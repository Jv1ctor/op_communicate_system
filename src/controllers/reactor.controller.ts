import { Request, Response } from "express"
import ReactorService from "../services/reactor.service"
import NotificationsService from "../services/notifications.service"

export const listReactors = async (req: Request, res: Response) => {
  try {
    const user = req.signedCookies.user
    const reactors = await ReactorService.list()
    const notification = await NotificationsService.listAll()
    res.render("pages/reactor", {
      reactor_list: reactors,
      user,
      notification,
      first_notification: notification[0],
    })
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}
