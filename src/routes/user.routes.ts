import { Router } from "express"
import * as UserController from "../controllers/user.controller"
import Auth from "../middleware/auth"
const router = Router()

router.get(
  "/list-reactors",
  Auth.authenticate,
  Auth.authorization("admin"),
  UserController.listReactors,
)
router.post(
  "/create-reactors",
  Auth.authenticate,
  Auth.authorization("admin"),
  UserController.createReactors,
)
router.post(
  "/register-user",
  Auth.authenticate,
  Auth.authorization("admin"),
  UserController.registerUser,
)
router.post("/login", Auth.notExistCookie, UserController.login)
router.post("/refresh-token", UserController.refreshToken)
router.post("/logout-user", Auth.authenticate, UserController.logout)

export default router
