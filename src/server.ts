import httpServer from "./httpServer"
import { Server } from "socket.io"

const port = process.env.PORT || 3000
const io = new Server(httpServer)

io.on("connection", (socket) => {
  console.log("Ok")
})

httpServer.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`)
})
