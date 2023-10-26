import { fetchLogout, fetchToken } from "./fetch.js"

const reactorList = document.querySelector('[data-js="reactors-list"]')
const userNameSpan = document.querySelector('[data-js="user-name"]')
const userSetorSpan = document.querySelector('[data-js="user-setor"]')
const btnLogout = document.querySelector('[data-js="btn-logout"]')

const userNameFormat = (name) => {
  const arraysLetters = name.split(" ")
  const firstName = arraysLetters[0]
  const lastName = arraysLetters[arraysLetters.length - 1]
  const firstNameLetter = firstName[0].toUpperCase()
  const lastNameLetter = lastName[0].toUpperCase()

  return `${firstNameLetter}${firstName.slice(
    1,
  )} ${lastNameLetter}${lastName.slice(1)}`
}

const userInfoRender = () => {
  const userName = localStorage.getItem("name-user")
  const userType = localStorage.getItem("type-user")
  const formatedName = userNameFormat(userName)

  userNameSpan.textContent = formatedName
  userSetorSpan.innerHTML = `<strong>Setor:</strong>${userType}`
}

userInfoRender()
btnLogout.addEventListener("click", async (event) => {
  const responseToken = await fetchToken()
  if (responseToken.action["refresh_token"]) {
    const token = responseToken.token
    await fetchLogout(token)
    localStorage.removeItem("name-user")
    localStorage.removeItem("type-user")
    window.location.replace("./index.html")
  }
})
