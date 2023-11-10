const eventSource = new EventSource("http://localhost:3000/api/events/sse")

eventSource.addEventListener("notification", (messageEvent) => {
  console.log(messageEvent.data)
})

console.log(eventSource)
