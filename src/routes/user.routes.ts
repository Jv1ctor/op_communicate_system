import { Router } from "express"
import * as UserController from "../controllers/user.controller"
import * as ReactorController from "../controllers/reactor.controller"
import Auth from "../middleware/auth"
const router = Router()

router.get(
  "/list-reactors",
  Auth.authenticate,
  Auth.validRefreshToken,
  ReactorController.listReactors,
)
router.post(
  "/create-reactors",
  Auth.authenticate,
  Auth.validRefreshToken,
  Auth.authorization("admin"),
  ReactorController.createReactors,
)
router.post(
  "/register-user",
  Auth.authenticate,
  Auth.validRefreshToken,
  Auth.authorization("admin"),
  UserController.createUser,
)
router.post("/login", Auth.notExistCookie, UserController.login)
router.post("/refresh-token", Auth.validRefreshToken, UserController.refreshToken)
router.post("/logout-user", Auth.authenticate, UserController.logout)

export default router
