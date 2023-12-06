import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import dotenv from "dotenv"
import path from "path"
import mustacheExpress from "mustache-express"
import UserRoutes from "./routes/user.routes"
import NotificationRoutes from "./routes/notifications.routes"
import mainRoutes from "./routes/main.routes"
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.engine("mustache", mustacheExpress())
app.set("views", path.join(__dirname, "./views"))
app.set("view engine", "mustache")
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.static(path.join(__dirname, "../public")))
app.use(
  "/fontawesome",
  express.static(path.join(__dirname, "../node_modules/@fortawesome/fontawesome-free")),
)
app.use(helmet())
app.use(express.urlencoded({ extended: true }))

app.use(UserRoutes)
app.use(mainRoutes)
app.use(NotificationRoutes)

app.use((_req: Request, res: Response) => {
  res.status(404).render("pages/404")
})

app.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`)
})
