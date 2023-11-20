import config from "./config.js"

export const eventSource = new EventSource(`${config.BASIC_URL}/api/events/sse`)

eventSource.addEventListener("notification", (messageEvent) => {
  const data = JSON.parse(messageEvent.data)

  console.log(data)
})
