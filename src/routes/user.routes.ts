import { Router } from "express"
import * as UserController from "../controllers/user.controller"
const router = Router()

router.get("/profile")
router.post("/register-user", UserController.registerUser)
router.post("/login")
router.post("/logout")
router.post("/refresh-token")
router.delete("/delete-use/:id")

export default router
