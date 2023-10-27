import { fetchLogout, fetchReactorsList, fetchToken } from "./fetch.js"

const reactorList = document.querySelector('[data-js="reactors-list"]')
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

  userNameSpan.textContent = userName ? formatedName : "Sem Nome"
  userSetorSpan.innerHTML = userType ? `<strong>Setor:</strong>${userType}` : "Sem Nome"
}

const reactorsRender = async () => {
  const { action, token } = await fetchToken()
  if (action.refresh_token) {
    const { reactors } = await fetchReactorsList(token)
    if (reactors.length > 0) {
      reactors.map((reactor) => {
        const formatNameReactor = reactor.name_reactor.replace("R", "")
        reactorList.innerHTML += `<li><a href="">Reator ${formatNameReactor}</a></li>`
      })
      return
    }
    reactorList.innerHTML = "<span class='not-found-list'>Sem Reactores</span>"
    return
  }
  window.location.replace("./login.html")
}

reactorsRender()
userInfoRender()
btnLogout.addEventListener("click", async (event) => {
  const responseToken = await fetchToken()
  if (responseToken.action["refresh_token"]) {
    const token = responseToken.token
    await fetchLogout(token)
    localStorage.removeItem("name-user")
    localStorage.removeItem("type-user")
    window.location.replace("./login.html")
  }
})
