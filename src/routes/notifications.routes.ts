import { Router } from "express"
import * as UserController from "../controllers/user.controller"
import * as EventController from "../controllers/event.controller"
import Auth from "../middleware/auth"
import Token from "../middleware/token"
const router = Router()

router.get(
  "/delete/:notificationId",
  Token.create,
  Auth.authenticate,
  EventController.deleteNotification,
)
router.get("/events/sse", Token.create, Auth.authenticate, EventController.events)



export default router
