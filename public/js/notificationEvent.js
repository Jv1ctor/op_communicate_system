import config from "./config.js"
import { renderProduct } from "./renders/renderProdutos.js"
import { renderNotification } from "./renders/renderNotification.js"
import {
  productStatus,
  renderAnalyse,
  renderConfirmAnalyse,
} from "./renders/renderAnalyse.js"

const notificationDropdown = document.getElementById("dropdown")
export const eventSource = new EventSource(`${config.BASIC_URL}/events/sse`)
const notificationAudio = new Audio("/audio/achive-sound-132273.mp3")

eventSource.addEventListener("notification", (messageEvent) => {
  notificationDropdown.checked = true
  notificationAudio.play()
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
  productStatus(data)
})

eventSource.addEventListener("confirm-analyse", (messageEvent) => {
  const data = JSON.parse(messageEvent.data)
  renderConfirmAnalyse(data)
})

window.addEventListener("beforeunload", () => {
  eventSource.close()
})
