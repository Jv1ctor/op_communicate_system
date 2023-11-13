import { Router } from "express"
import * as EventController from "../controllers/event.controller"
import Auth from "../middleware/auth"

const router = Router()

router.get("/sse", EventController.events)
router.get("/list-product/:reactor", EventController.listProduct)
router.post("/create-product", Auth.authenticate, EventController.createProduct)
router.post("/create-analisys", EventController.createAnalisys)

export default router
