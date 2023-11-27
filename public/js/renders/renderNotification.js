const notificationList = document.querySelector("[data-js='list-notification']")
const notifyCircle = document.querySelector(".circle-notification")
const notificationListChildren = notificationList.children

const formattingHTMLData = (data) => {
  const notifications = Array.from(data).sort((item1, item2) => {
    const timeNotificationOne = new Date(item1[1].created_at)
    const timeNotificationTwo = new Date(item2[1].created_at)

    return timeNotificationTwo - timeNotificationOne
  })

  notifyCircle.setAttribute("data-notification", notifications[0][1].type_notification)
  notifyCircle.setAttribute("data-status_product", notifications[0][1].status)

  let template = ""

  const typeNotificationFormat = {
    product: "Produto",
    analysis: "Análise",
  }

  notifications.forEach((item) => {
    const notificationData = item[1]
    const currentDate = new Date(notificationData.created_at)
    const dateFormat = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(currentDate)

    template += `
      <li class="
        notification-${notificationData.type_notification} 
        ${notificationData.status ? `product-${notificationData.status}` : ""}
      ">
        <i class="fa-solid fa-circle-exclamation alert-notification-icon"></i>
          <div class="content-notification">
            <h3 class="title-notification">Atenção ${
              typeNotificationFormat[notificationData.type_notification]
            } ${notificationData?.count || ""}:</h3>
            
            <p>${notificationData.product_name} - ${notificationData.reactor_name}
            </p>
            ${
              notificationData.status && notificationData.type_notification === "product"
                ? `<p class="status-notification"> ${notificationData.status}</p>`
                : ""
            }
          </div>
          <p>${dateFormat}</p>
      </li>`
  })

  return template
}

export const renderNotification = (data) => {
  if (data) {
    notificationList.innerHTML = ""
    notificationList.innerHTML += formattingHTMLData(data)
  }
}

export const runNotification = () => {
  setInterval(() => {
    if (notificationListChildren.length > 0) {
      notifyCircle.classList.add("show-notification-circle")
    } else {
      notifyCircle.classList.remove("show-notification-circle")
      notificationList.innerHTML = "Nenhuma Notificação"
    }
  }, 200)
}
