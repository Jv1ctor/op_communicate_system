import config from "./config.js"
import { renderProduct } from "./renders/renderProdutos.js"
// import { renderAnalyse, renderProductData } from "./renders/renderAnalyse.js"
import { renderNotification } from "./renders/renderNotification.js"
import { renderAnalyse } from "./renders/renderAnalyse.js"

const notificationDropdown = document.getElementById("dropdown")
export const eventSource = new EventSource(`${config.BASIC_URL}/events/sse`)

eventSource.addEventListener("notification", (messageEvent) => {
  notificationDropdown.checked = true
  // setInterval(() => {
  //   if (!body.classList.contains("show-modal")) {
  //     window.location.reload()
  //   }
  // }, 1000)

  const data = JSON.parse(messageEvent.data)
  renderNotification(data)
})

eventSource.addEventListener("create-product", (messageEvent) => {
  const data = JSON.parse(messageEvent.data)
  renderProduct(data, "andamento")
})

eventSource.addEventListener("create-analyse", (messageEvent) => {
  const data = JSON.parse(messageEvent.data)
  renderAnalyse(data)
})

eventSource.addEventListener("finish-product", (messageEvent) => {
  const data = JSON.parse(messageEvent.data)
  renderProduct(data, data.status)
})

window.addEventListener("beforeunload", () => {
  eventSource.close()
})
