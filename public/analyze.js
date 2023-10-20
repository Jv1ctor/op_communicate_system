const socket = io()

socket.on("create:product", (data) => {
  console.log(data)
})

socket.emit("read:product", null, (data) => {
  console.log(data)
})

socket.emit("create:analysis", { product: "produto 1", analyze: "analise 1" })
socket.on("create:analysis", (data) => {
  console.log(data)
})
