const notificationList = document.querySelector("[data-js='list-notification']")
const notifyCircle = document.querySelector(".circle-notification")
const notificationListChildren = notificationList.children
const message = document.createElement("p")

const formattingHTMLData = (data) => {
  let template = ""
  data.forEach((item) => {
    notifyCircle.setAttribute("data-notification", item.type_notification)
    notifyCircle.setAttribute("data-status_product", item.status)

    template += `
    <li class="
      notification-${item.type_notification} 
      ${item.status ? `product-${item.status}` : ""}
    ">
      <i class="fa-solid fa-circle-exclamation alert-notification-icon"></i>
        <div class="content-notification">
          <h3 class="title-notification">Atenção ${item.type_notification} ${
      item.count || ""
    }:</h3>
          
          <p>
          ${item.name_product} - ${item.reactor} 
          </p>
          ${
            item.status && item.type_notification === "Produto"
              ? `<p class="status-notification"> ${item.status}</p>`
              : ""
          }
        </div>
        <p>${item.formattingDate}</p>
    </li>`
  })

  return template
}

export const renderNotification = (data) => {
  console.log(data)
  if (data) {
    message.remove()
    const formatData = formattingHTMLData(data)
    if (data[0].status !== "andamento" && data[0].type_notification === "Produto") {
      notificationList.innerHTML = formatData
    } else {
      notificationList.insertAdjacentHTML("afterbegin", formatData)
    }
  }
}

const runNotification = () => {
  setInterval(() => {
    if (
      notificationListChildren.length > 0 &&
      notificationListChildren.item(0) !== message
    ) {
      notifyCircle.classList.add("show-notification-circle")
    } else {
      notifyCircle.classList.remove("show-notification-circle")
      message.textContent = "Nenhuma Notificação"
      notificationList.append(message)
    }
  }, 500)
}

runNotification()
