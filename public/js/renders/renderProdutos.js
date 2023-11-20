import { fetchCreateProduct } from "../user/fetch.js"
import { generateToken, verifyGenerateToken } from "../user/token.js"
import { modal, modalForm } from "../modal.js"

export const renderProduto = async () => {
  const token = await verifyGenerateToken()
  if (token) {
    const createProduct = async (e) => {
      e.preventDefault()
      const listInputValue = Array.from(e.target)
      const data = listInputValue.reduce((acc, item) => {
        if (!item.classList.contains("button")) {
          if (item.value && modalForm.turn.value !== "-1") {
            acc[item.id] = item.value
          }
        }
        return acc
      }, {})

      const newToken = await generateToken()
      const nameReactor = localStorage.getItem("reactor")
      data.reactor = nameReactor
      const response = await fetchCreateProduct(newToken, data)
      if (response) {
        modalForm.reset()
        modal.classList.toggle("show-modal")
        document.body.classList.toggle("show-modal")
      }
    }

    modalForm.addEventListener("submit", createProduct)
    return
  }
}
