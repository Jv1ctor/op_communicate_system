import { Router } from "express"
import * as UserController from "../controllers/user.controller"
import Auth from "../middleware/auth"
const router = Router()

router.get("/profile-user", Auth.authenticate, UserController.profile)
router.post("/admin/register-user", UserController.registerUser)
router.post("/login", UserController.login)
router.post("/refresh-token", UserController.refreshToken)
router.post("/logout-user", Auth.authenticate, UserController.logout)
router.delete("/admin/delete-use/:id")

export default router
