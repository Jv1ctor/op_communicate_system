import { renderReactor, reactorList } from "../renders/renderReatores.js"

const saveReactorName = (event) => {
  if (event.target.dataset.js === "link-reactor-btn") {
    const reactorName = event.target.id

    localStorage.setItem("reactor", reactorName)
  }
}

reactorList.addEventListener("click", saveReactorName)

renderReactor()
