const socket = io()

socket.emit("create:product", "produto 1")
socket.on("create:product", (data) => {
  console.log(data)
})

socket.on("create:analysis", (data) => {
  console.log(data)
})
