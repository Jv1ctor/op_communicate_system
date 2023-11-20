import { eventSource } from "../notificationEvent.js"
import { fetchLogout } from "./fetch.js"
import { verifyGenerateToken } from "./token.js"

const userNameSpan = document.querySelector('[data-js="user-name"]')
const userSetorSpan = document.querySelector('[data-js="user-setor"]')
const btnLogout = document.querySelector('[data-js="btn-logout"]')

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

const userLogout = async (event) => {
  const token = await verifyGenerateToken()
  if (token) {
    await fetchLogout(token)
    localStorage.clear()
    window.location.replace("./login.html")
  }
}

const closeSSE = () => eventSource.close()

userInfoRender()
btnLogout.addEventListener("click", userLogout)
window.addEventListener("beforeunload", closeSSE)