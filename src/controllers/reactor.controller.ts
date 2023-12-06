import { Request, Response } from "express"
import ReactorService from "../services/reactor.service"
import NotificationsService from "../services/notifications.service"

export const listReactors = async (req: Request, res: Response) => {
  try {
    const user = req.signedCookies.user
    const userId = res.locals.userId
    const reactors = ReactorService.list()
    const notification = NotificationsService.listAll(userId)
    const [listReactor, listNotification] = await Promise.all([reactors, notification])
   res.cookie("last_page", req.originalUrl, { 
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      signed: true,
    }).render("pages/reactor", {
      reactor_list: listReactor,
      user,
      notification: listNotification,
      first_notification: listNotification[0],
    })
  } catch (err) {
    res.status(500).render("pages/500", { err })
  }
}
