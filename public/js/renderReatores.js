import { fetchReactorsList } from "./fetch.js"
import { verifyGenerateToken } from "./token.js"

const reactorList = document.querySelector('[data-js="reactors-list"]')

const reactorsRender = async () => {
  const token = await verifyGenerateToken()
  if (token) {
    const resListReactor = await fetchReactorsList(token)
    if (resListReactor && resListReactor.reactors) {
      if (resListReactor.reactors.length > 0) {
        resListReactor.reactors.map((reactor) => {
          const formatNameReactor = reactor.name_reactor.replace("R", "")
          reactorList.innerHTML += `<li><a href="./produtos.html" data-js="link-reactor-btn" id="${reactor.name_reactor}">Reator ${formatNameReactor}</a></li>`
        })
        return
      }
      reactorList.innerHTML = "<span class='not-found-list'>Sem Reatores</span>"
      return
    }
    localStorage.removeItem("access-token")
    window.location.reload()
  }
}

reactorsRender()
reactorList.addEventListener("click", (event) => {
  if (event.target.dataset.js === "link-reactor-btn") {
    const reactorName = event.target.id

    localStorage.setItem("reactor", reactorName)
  }
})
