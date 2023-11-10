import { fetchLogin } from "./fetch.js"

const form = document.querySelector('[data-js="login-form"]')
const message = document.querySelector('[data-js="message-js"]')
message.textContent = ""

const verifyLogin = () => {
  const token = localStorage.getItem("access-token")
  if (token) {
    window.location.replace("./index.html")
  }
}

verifyLogin()
form.addEventListener("submit", async (event) => {
  event.preventDefault()
  message.textContent = ""
  const nameUser = form["user-name"].value
  const passUser = form["user-pass"].value

  const validName = nameUser.includes(".")

  if (validName) {
    const response = await fetchLogin(nameUser, passUser)

    if (response.action.login) {
      const { first_name, last_name, type_user } = response.user_profile
      localStorage.setItem("name-user", `${first_name} ${last_name}`)
      localStorage.setItem("type-user", type_user)
      window.location.replace("./index.html")
      return
    }
    message.textContent = "Usuário não existe ou senha errada"
    return
  }
  message.textContent = 'Digite o nome do usuario nesse formato: "teste.teste"'
})
