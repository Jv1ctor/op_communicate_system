import { fetchReactorsList } from "../user/fetch.js"
import { verifyGenerateToken } from "../user/token.js"

export const reactorList = document.querySelector('[data-js="reactors-list"]')

export const renderReactor = async () => {
  const token = await verifyGenerateToken()
  if (token) {
    const resListReactor = await fetchReactorsList(token)
    if (resListReactor && resListReactor.reactors) {
      if (resListReactor.reactors.length > 0) {
        resListReactor.reactors.map((reactor) => {
          const formatNameReactor = reactor.name_reactor.replace("R", "")
          reactorList.innerHTML += `
          <li>
            <a href="./produtos.html" data-js="link-reactor-btn" id="${reactor.name_reactor}">
            Reator ${formatNameReactor} 
            <i class="fa-solid fa-exclamation notification-reactor"></i>
            </a>
          </li>`
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
