import { Router } from "express"
import * as UserController from "../controllers/user.controller"
import * as ReactorController from "../controllers/reactor.controller"
import * as EventController from "../controllers/event.controller"
import Auth from "../middleware/auth"
import Token from "../middleware/token"
const router = Router()

router.get(
  "/",
  Auth.Logged,
  Token.create,
  Auth.authenticate,
  ReactorController.listReactors,
)

router.get(
  "/reator/:id",
  Auth.Logged,
  Token.create,
  Auth.authenticate,
  EventController.listProducts,
)

router.get("/login", (req, res) => {
  const refreshToken = req.signedCookies.refreshToken
  if (refreshToken) {
    res.redirect("/")
    return
  }
  res.render("pages/login")
})
router.get("/logout", UserController.logout)
router.post("/login", UserController.login)

export default router
