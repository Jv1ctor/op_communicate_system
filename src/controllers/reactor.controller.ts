import { Request, Response } from "express"
import ReactorService from "../services/reactor.service"
import NotificationsService from "../services/notifications.service"

export const listReactors = async (req: Request, res: Response) => {
  try {
    const user = req.signedCookies.user
    const reactors = ReactorService.list()
    const notification = NotificationsService.listAll()
    const [listReactor, listNotification] = await Promise.all([reactors, notification])

    res.render("pages/reactor", {
      reactor_list: listReactor,
      user,
      notification: listNotification,
      first_notification: listNotification[0],
    })
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}
