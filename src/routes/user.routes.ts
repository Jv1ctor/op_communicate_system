import { Router } from "express"
import * as UserController from "../controllers/user.controller"
const router = Router()

router.get("/profile")
router.post("/regiserUser")
router.post("/login")
router.post("/logout")
router.post("/refreshToken")

export default router
