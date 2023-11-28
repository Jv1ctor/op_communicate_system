import { runModal } from "../modal.js"
import { runMenu } from "./menu.js"
import { renderProduct, submitFormProduct } from "../renders/renderProdutos.js"
import { runFormattingInput } from "./formattingInputs.js"

const tables = document.querySelector("[data-js='tables']")

// runFormattingInput()
// runModal()
runMenu()
submitFormProduct()
tables.addEventListener("click", saveProductName)
