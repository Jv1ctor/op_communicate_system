import config from "./config.js"
import { renderProduct } from "./renders/renderProdutos.js"
import { renderNotification } from "./user/notification.js"

export const eventSource = new EventSource(`${config.BASIC_URL}/api/events/sse`)

let notificationMap = new Map()
eventSource.addEventListener("notification", (messageEvent) => {
  const data = JSON.parse(messageEvent.data)
  notificationMap.set(data.reactor_name, data)
  renderNotification(notificationMap)
})

eventSource.addEventListener("create-product", (messageEvent) => {
  const data = JSON.parse(messageEvent.data)
  renderProduct(data)
})
