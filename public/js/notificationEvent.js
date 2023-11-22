import config from "./config.js"
import { renderProduct } from "./renders/renderProdutos.js"
import { renderAnalyse } from "./renders/renderAnalyse.js"
import { renderNotification } from "./renders/renderNotification.js"

const notificationDropdown = document.getElementById("dropdown")
export const eventSource = new EventSource(`${config.BASIC_URL}/api/events/sse`)

let notificationMap = new Map()

eventSource.addEventListener("notification", (messageEvent) => {
  const data = JSON.parse(messageEvent.data)

  if (data.type_notification === "product") {
    notificationMap.set(data.reactor_name, data)
  }
  if (data.type_notification === "analysis" && data.count) {
    notificationMap.set(data.reactor_name + data.count, data)
  }
  renderNotification(notificationMap)
})

eventSource.addEventListener("create-product", (messageEvent) => {
  notificationDropdown.checked = true
  const data = JSON.parse(messageEvent.data)
  renderProduct(data)
})

eventSource.addEventListener("create-analyse", (messageEvent) => {
  notificationDropdown.checked = true
  const data = JSON.parse(messageEvent.data)
  renderAnalyse(data)
})
