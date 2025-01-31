import { fetchReactorsList } from "../user/fetch.js"
import { reactorList } from "../config.js"

export const renderReactor = async (token) => {
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
    } else {
      localStorage.removeItem("access-token")
      window.location.reload()
    }
  }
}
