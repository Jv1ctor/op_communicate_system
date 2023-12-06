import { Router } from "express"
import * as UserController from "../controllers/user.controller"
const router = Router()

router.get("/login", UserController.renderPageLogin)
router.get("/logout", UserController.logout)
router.post("/login", UserController.login)


export default router
