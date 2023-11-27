import { Router } from "express"
import * as UserController from "../controllers/user.controller"
import * as ReactorController from "../controllers/reactor.controller"
import Auth from "../middleware/auth"
const router = Router()

router.get("/", (req, res) => {
  res.render("pages/login")
})


export default router