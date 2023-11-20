import config from "./config.js"

export const eventSource = new EventSource(`${config.BASIC_URL}/api/events/sse`)

eventSource.addEventListener("notification", (messageEvent) => {
  console.log(messageEvent)
})
