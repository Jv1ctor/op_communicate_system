const notificationList = document.querySelector("[data-js='list-notification']")
const notifyCircle = document.querySelector(".circle-notification")
const notificationListChildren = notificationList.children

const formattingHTMLData = (data) => {
  const notifications = Array.from(data).reverse()
  let template = ""
  const typeNotificationFormat = {
    product: "produto",
    analisys: "Análise",
  }

  notifications.forEach((item) => {
    const productData = item[1]
    const currentDate = new Date(productData.created_at)
    const dateFormat = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(currentDate)

    template += `
      <li>
        <i class="fa-solid fa-circle-exclamation alert-notification-icon"></i>
          <div class="content-notification">
            <h3 class="title-notification">Atenção ${
              typeNotificationFormat[productData.type_notification]
            }:</h3>
            <p>${productData.product_name} - ${productData.reactor_name}</p>
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
      notificationList.innerHTML = "Nenhuma Notificação"
    }
  }, 200)
}
