import { fetchToken } from "./fetch.js"

const reactorList = document.querySelector('[data-js="reactors-list"]')
const userNameSpan = document.querySelector('[data-js="user-name"]')

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

const userNameRender = () => {
  const userName = localStorage.getItem("name-user")

  const formatedName = userNameFormat(userName)

  userNameSpan.textContent = formatedName
}

userNameRender()
