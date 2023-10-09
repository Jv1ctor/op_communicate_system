import express, { Request, Response } from "express"
import helmet from "helmet"
import userRoutes from "./routes/user.routes"
import dotenv from "dotenv"

dotenv.config()

const server = express()
const port = process.env.PORT || 3000

server.use(helmet())
server.use(express.json())

server.use("/api/user", userRoutes)

server.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "endpoint not found" })
})

server.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`)
})
