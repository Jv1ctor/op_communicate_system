import { fetchReactorsList } from "./fetch.js"
import { verifyGenerateToken } from "./token.js"

const reactorList = document.querySelector('[data-js="reactors-list"]')

const reactorsRender = async () => {
  const token = await verifyGenerateToken()
  if (token) {
    console.log(token)
    const { reactors } = await fetchReactorsList(token)
    if (reactors.length > 0) {
      reactors.map((reactor) => {
        const formatNameReactor = reactor.name_reactor.replace("R", "")
        reactorList.innerHTML += `<li><a href="./produtos.html" data-js="link-reactor-btn" id="${reactor.name_reactor}">Reator ${formatNameReactor}</a></li>`
      })
      return
    }
    reactorList.innerHTML = "<span class='not-found-list'>Sem Reactores</span>"
    return
  }
  console.log(token)
  localStorage.removeItem("access-token")
  window.location.replace("./login.html")
}

reactorsRender()
reactorList.addEventListener("click", (event) => {
  if (event.target.dataset.js === "link-reactor-btn") {
    const reactorName = event.target.id

    localStorage.setItem("reactor", reactorName)
  }
})
