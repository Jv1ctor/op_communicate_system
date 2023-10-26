import { fetchLogin } from "./fetch.js"

const form = document.querySelector('[data-js="login-form"]')
const message = document.querySelector('[data-js="message-js"]')
message.textContent = ""

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
      window.location.replace("./reatores.html")
      return
    }
    message.textContent = "Usuário não existe ou senha errada"
    return
  }
  message.textContent = 'Digite o nome do usuario nesse formato: "teste.teste"'
})
