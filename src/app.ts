import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import dotenv from "dotenv"
import path from "path"
import userRoutes from "./routes/user.routes"
import eventRoutes from "./routes/event.routes"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cookieParser())
app.use(express.static(path.join(__dirname, "../public")))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/events", eventRoutes)
app.use("/api/user", userRoutes)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "endpoint not found" })
})

app.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`)
})
