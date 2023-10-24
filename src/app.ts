import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import userRoutes from "./routes/user.routes"
import dotenv from "dotenv"
import path from "path"

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.static(path.join(__dirname, "../public")))
app.use(helmet())
app.use(express.json())

app.use("/api/user", userRoutes)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "endpoint not found" })
})

export default app
