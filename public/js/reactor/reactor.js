import { renderReactor } from "../renders/renderReatores.js"
import { reactorList } from "../config.js"
import { verifyGenerateToken } from "../user/token.js"

const saveReactorName = (event) => {
  if (event.target.dataset.js === "link-reactor-btn") {
    const reactorName = event.target.id

    localStorage.setItem("reactor", reactorName)
  }
}

reactorList.addEventListener("click", saveReactorName)

verifyGenerateToken().then( (token) => {
  renderReactor(token)

}).catch(err => console.log(err))

