import { fetchLogin } from "./fetch.js"

const form = document.querySelector('[data-js="login-form"]')

form.addEventListener("change", async (event) => {
  const message = document.querySelector('[data-js="message-js"]')
  if (message) {
    const nameUser = form["name"].value
    const validName = nameUser.includes(".")

    if (!validName && form.submit()) {
      message.textContent = "Usuário não existe ou senha errada"
      return
    }
    message.textContent = 'Digite o nome do usuario nesse formato: "teste.teste"'
  }
})
