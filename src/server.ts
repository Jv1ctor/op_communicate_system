import httpServer from "./httpServer"
import { Server } from "socket.io"

const port = process.env.PORT || 3000
const io = new Server(httpServer)

const product: any[] = []
let countProd = 0
let countAn = 0
io.on("connection", (socket) => {
  socket.on("create:product", (data) => {
    socket.join(data)
    product.push(`${data} ${countProd++}`)
    console.log(`id do socket ${socket.id}. Messagem ${data}`)
    io.to(data).emit(
      "create:product",
      `${data} - ${countProd} passou pelo servidor`,
    )
  })

  socket.on("read:product", (_, callback) => {
    callback(product)
  })

  socket.on("create:analysis", (data) => {
    console.log(
      `id do socket ${socket.id}. Messagem ${data.product} - ${data.analyze} `,
    )
    socket.join(data.product)

    io.to(data.product).emit(
      "create:analysis",
      `${data.analyze} - ${countAn++} passou pelo servidor`,
    )
  })
})

httpServer.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`)
})
