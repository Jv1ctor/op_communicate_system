import { fetchReactorsList, fetchToken } from "./fetch.js"

const reactorList = document.querySelector('[data-js="reactors-list"]')

const reactorsRender = async () => {
  const resRefreshToken = await fetchToken()
  if (resRefreshToken) {
    const token = resRefreshToken.token
    const { reactors } = await fetchReactorsList(token)
    if (reactors.length > 0) {
      reactors.map((reactor) => {
        const formatNameReactor = reactor.name_reactor.replace("R", "")
        reactorList.innerHTML += `<li><a href="./produtos.html?reactor=${formatNameReactor}">Reator ${formatNameReactor}</a></li>`
      })
      return
    }
    reactorList.innerHTML = "<span class='not-found-list'>Sem Reactores</span>"
    return
  }
  window.location.replace("./login.html")
}

reactorsRender()
