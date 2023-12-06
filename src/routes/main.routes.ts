import { Router } from "express"
import * as ReactorController from "../controllers/reactor.controller"
import * as ProductController from "../controllers/product.controller"
import * as AnalysisController from "../controllers/analysis.controller"
import Auth from "../middleware/auth"
import Token from "../middleware/token"
const router = Router()

router.get("/", Token.create, Auth.authenticate, ReactorController.listReactors)
router.get("/reator/:id", Token.create, Auth.authenticate, ProductController.listProducts)

router.get(
  "/reator/produto/:reactorId.:productId",
  Token.create,
  Auth.authenticate,
  AnalysisController.listAnalysis,
)

router.get(
  "/checked-analysis/:analysisId",
  Token.create,
  Auth.authenticate,
  Auth.authorization("production"),
  AnalysisController.checkedAnalysis,
)

router.post(
  "/register-product/reator/:id",
  Token.create,
  Auth.authenticate,
  Auth.authorization("production"),
  ProductController.createProduct,
)

router.post(
  "/finished-product/:reactorId.:productId",
  Token.create,
  Auth.authenticate,
  Auth.authorization("quality"),
  ProductController.finishProduct,
)

router.post(
  "/create-analyse/:reactorId.:productId",
  Token.create,
  Auth.authenticate,
  Auth.authorization("quality"),
  AnalysisController.createAnalysis,
)
export default router
