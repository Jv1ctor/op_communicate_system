import { Router } from "express"
import * as UserController from "../controllers/user.controller"
import * as ReactorController from "../controllers/reactor.controller"
import * as EventController from "../controllers/event.controller"
import Auth from "../middleware/auth"
import Token from "../middleware/token"
const router = Router()

router.get("/", Token.create, Auth.authenticate, ReactorController.listReactors)

router.get("/reator/:id", Token.create, Auth.authenticate, EventController.listProducts)
router.get("/login", (req, res) => {
  const refreshToken = req.signedCookies.refreshToken
  if (refreshToken) {
    res.redirect("/")
    return
  }
  res.render("pages/login")
})

router.get("/logout", UserController.logout)
router.get(
  "/reator/produto/:reactorId.:productId",
  Token.create,
  Auth.authenticate,
  EventController.listAnalysis,
)

router.get(
  "/delete/:notificationId",
  Token.create,
  Auth.authenticate,
  EventController.deleteNotification,
)

router.post("/login", UserController.login)
router.post(
  "/register-product/reator/:id",
  Token.create,
  Auth.authenticate,
  Auth.authorization("production"),
  EventController.createProduct,
)
router.post(
  "/create-analyse/:reactorId.:productId",
  Token.create,
  Auth.authenticate,
  Auth.authorization("quality"),
  EventController.createAnalysis,
)
router.post(
  "/finished-product/:reactorId.:productId",
  Token.create,
  Auth.authenticate,
  Auth.authorization("quality"),
  EventController.finishProduct,
)

router.get("/events/sse", Token.create, Auth.authenticate, EventController.events)

export default router
