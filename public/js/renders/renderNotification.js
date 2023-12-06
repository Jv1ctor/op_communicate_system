const notificationList = document.querySelector("[data-js='list-notification']")
const notifyCircle = document.querySelector(".circle-notification")
const notificationListChildren = notificationList.children
const message = document.createElement("p")

const formattingHTMLData = (data) => {
  let template = ""
  data.forEach((item) => {
    notifyCircle.setAttribute("data-notification", data[0].type_notification)
    notifyCircle.setAttribute("data-status_product", data[0].status)

    template += `
    <li class="
      notification-${item.type_notification} 
      ${item.status ? `product-${item.status}` : ""}
    "> 
      ${
        item.status !== "andamento" && item.type_notification === "Produto"
          ? `<a class="delete-notification" href="/delete/${item.notification_id}"> <i class="fa-solid fa-xmark close-button"></i></a>`
          : " "
      }
      
      <a class="notification-link" href="/reator/produto/${item.reactor_id}.${
      item.product_id
    }">
        ${
          item.type_notification === "Análise"
            ? '<i class="fa-solid fa-triangle-exclamation alert-notification-icon"></i>'
            : '<i class="fa-solid fa-circle-exclamation alert-notification-icon"></i>'
        }

        <div class="content-notification">
          <h3 class="title-notification">
            Atenção ${item.type_notification} ${item.count || ""}:
          </h3>
            
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
      </a>
    </li>`
  })

  return template
}

export const renderNotification = (data) => {
  const notifications = data
  if (notifications) {
    message.remove()
    const formatData = formattingHTMLData(notifications)

    if (data.length > 0) {
      notificationList.innerHTML = formatData
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
