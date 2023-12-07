import { runModal } from "../modal.js"
import { renderAnalyse, renderConfirmAnalyse } from "../renders/renderAnalyse.js"
import { runBoxConfirm } from "./confirmBox.js"

const productStatus = document.querySelector(".data-status")

runModal()
renderAnalyse()
if (
  sessionStorage.getItem("type-user") === "Produção" &&
  productStatus.classList.contains("andamento")
) {
  runBoxConfirm()
}
