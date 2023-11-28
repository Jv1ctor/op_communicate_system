import { eventSource } from "../notificationEvent.js"
import { fetchLogout } from "./fetch.js"
import { verifyGenerateToken } from "./token.js"
import { runNotification } from "../renders/renderNotification.js"
import { buttonModal, buttonModalFinish } from "../config.js"

const userNameSpan = document.querySelector('[data-js="user-name"]')
const userSetorSpan = document.querySelector('[data-js="user-setor"]')
const btnLogout = document.querySelector('[data-js="btn-logout"]')

const userPermissOptions = () => {
  const permissUserProdBtn = buttonModal?.dataset.permiss === "producer"
  const permissUserCQBtn = buttonModal?.dataset.permiss === "controler-quality"
  const permissUserCQBtnFinish =
    buttonModalFinish?.dataset.permiss === "controler-quality"
  if (typeUser === "Produção" && permissUserProdBtn) {
    buttonModal.classList.remove("hidden-button")
  }

  if (typeUser === "Controle Qualidade" && permissUserCQBtn) {
    buttonModal.classList.remove("hidden-button")
  }

  if (typeUser === "Controle Qualidade" && permissUserCQBtnFinish) {
    buttonModalFinish.classList.remove("hidden-button")
  }
}

const userNameFormat = (name) => {
  if (name) {
    const arraysLetters = name.split(" ")
    const firstName = arraysLetters[0]
    const lastName = arraysLetters[arraysLetters.length - 1]
    const firstNameLetter = firstName[0].toUpperCase()
    const lastNameLetter = lastName[0].toUpperCase()

    return `${firstNameLetter}${firstName.slice(1)} ${lastNameLetter}${lastName.slice(1)}`
  }
}

const userInfoRender = () => {
  const userName = localStorage.getItem("name-user")
  const userType = localStorage.getItem("type-user")
  const formatedName = userNameFormat(userName)

  userNameSpan.innerHTML = userName ? formatedName : "Sem Nome"
  userNameSpan.setAttribute("title", userName ? formatedName : "Sem Nome")
  userSetorSpan.innerHTML = userType ? userType : "Sem Nome"
  userSetorSpan.setAttribute("title", userType ? userType : "Sem Nome")
}

const userLogout = async (_event) => {
  const token = await verifyGenerateToken()
  if (token) {
    await fetchLogout(token)
    localStorage.clear()
    window.location.replace("./login.html")
  }
}

const closeSSE = () => eventSource.close()

userPermissOptions()
userInfoRender()
runNotification()
btnLogout.addEventListener("click", userLogout)
window.addEventListener("beforeunload", closeSSE)
