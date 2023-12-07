const listAnalysis = document.querySelector("[data-js='analyse-list']")

export const runBoxConfirm = () => {
  listAnalysis.addEventListener("click", (e) => {
    if (
      e.target.dataset.js === "checked-button" &&
      !e.target.classList.contains("checked-style")
    ) {
      const container = e.target.parentElement.parentElement.parentElement
      const boxConfirm = container.querySelector("[data-js='box-confirm']")
      boxConfirm.classList.toggle("show-box-confirm")
    }

    if (e.target.classList.contains("not-confirm")) {
      const container = e.target.parentElement.parentElement.parentElement.parentElement
      const boxConfirm = container.querySelector("[data-js='box-confirm']")
      boxConfirm.classList.toggle("show-box-confirm")
    }
  })
}
