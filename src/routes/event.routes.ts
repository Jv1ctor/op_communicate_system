import { Router } from "express"
import * as EventController from "../controllers/event.controller"
import Auth from "../middleware/auth"

const router = Router()

router.get("/sse", EventController.events)
router.get(
  "/list-product",
  Auth.authenticate,
  Auth.validRefreshToken,
  EventController.listProduct,
)
router.post(
  "/create-product",
  Auth.authenticate,
  Auth.validRefreshToken,
  Auth.authorization("production"),
  EventController.createProduct,
)
router.put(
  "/finish-product",
  Auth.authenticate,
  Auth.validRefreshToken,
  Auth.authorization("quality"),
  EventController.finishProduct,
)
router.post(
  "/create-analysis",
  Auth.authenticate,
  Auth.validRefreshToken,
  Auth.authorization("quality"),
  EventController.createAnalysis,
)
router.get(
  "/list-analysis",
  Auth.authenticate,
  Auth.validRefreshToken,
  EventController.listAnalysis,
)

export default router
