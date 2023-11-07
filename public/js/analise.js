const productName = document.querySelector("[data-js='product-name']")

const renderProductName = () => {
  const query = window.location.search
  const params = new URLSearchParams(query)
  const name = params.get("analise")
  console.log(name)
  productName.textContent = `${name}`
}

renderProductName()