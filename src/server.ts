import httpServer from "./httpServer"
import { Server } from "socket.io"
import AuthSocket from "./middleware/authSocket"

const port = process.env.PORT || 3000
const io = new Server(httpServer)

io.use(AuthSocket.authorization)
io.on("connection", (socket) => {
  console.log("passou")
  socket.on("create:product", (data) => {
    console.log(data)
  })

  socket.on("read:product", (_, callback) => {})

  socket.on("create:analysis", (data) => {})
})

httpServer.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`)
})
