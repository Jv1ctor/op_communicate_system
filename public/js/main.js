import { fetchLogin } from "./fetchLogin.js"

const form = document.querySelector('[data-js="login-form"]')
const message = document.querySelector('[data-js="message-js"]')
message.textContent = ""

console.log(document.cookie["refresh-token"])

form.addEventListener("submit", async (event) => {
  event.preventDefault()
  message.textContent = ""
  const nameUser = form["user-name"].value
  const passUser = form["user-pass"].value

  const validName = nameUser.includes(".")

  if (validName) {
    const response = await fetchLogin(nameUser, passUser)

    if (response.action.login) {
      const refreshTokenId = response.refresh_token.id
      document.cookie = "teste"
      // window.location.replace("./reatores.html")
    }
    message.textContent = "Usuário não existe ou senha errada"
    return
  }
  message.textContent = 'Digite o nome do usuario nesse formato: "teste.teste"'
})
