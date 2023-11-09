import { modalForm } from "./produto.js"
import { fetchCreateProduct, fetchToken } from "./fetch.js"

const eventSource = new EventSource("http://localhost:3000/api/events/sse")

eventSource.addEventListener("notification", (messageEvent) => {
  console.log(messageEvent.data)
})

console.log(eventSource)
const runEvent = async () => {
  const responseRefreshToken = await fetchToken()
  if (responseRefreshToken) {
    const token = responseRefreshToken.token
    const createProduct = async (e) => {
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

      const nameReactor = localStorage.getItem("reactor")
      data.reactor = nameReactor
      const response = await fetchCreateProduct(token, data)
      console.log(response)
      modalForm.reset()
    }

    modalForm.addEventListener("submit", createProduct)
    return
  }
  window.location.replace("./login.html")
}

runEvent()
