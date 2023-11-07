import { modalForm } from "./produto.js"
import { fetchToken } from "./fetch.js"

const runSocket = async () => {
  const responseRefreshToken = await fetchToken()
  if (responseRefreshToken) {
    const token = responseRefreshToken.token

    const socket = io({
      auth: {
        token: token,
      },
    })

    const createProduct = (e) => {
      e.preventDefault()
      const listInputValue = Array.from(e.target)
      const data = listInputValue.reduce((acc, item) => {
        if (!item.classList.contains("button")) {
          if (item.value && modalForm.turn.value !== "-1") {
            acc[item.id] = item.value
          }
        }
        return acc
      }, {})

      socket.emit("create:product", data)
      modalForm.reset()
    }

    modalForm.addEventListener("submit", createProduct)
  }
}

runSocket()
