const reactorName = document.querySelector('[data-js="reactor-name"]')

const renderReactorName = () => {
  const query = window.location.search
  const params = new URLSearchParams(query)
  const name = params.get("reactor")

  reactorName.textContent = `Reator ${name}`
}

renderReactorName()
