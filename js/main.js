import { getCreatures } from "./api.js";
import { renderGrid, renderGridError, renderGridLoading, updateCounter } from "./ui.js";
const grid = document.querySelector("#grid");
const allBtnFilters = document.querySelectorAll("#filters button");
let currentFilter = "all";
const loadCreatures = async () => {
  renderGridLoading();
  try {
    const creatures = await getCreatures({ type: currentFilter });
    updateCounter(creatures.length);
    renderGrid(creatures);
  } catch (error) {
    console.error("Erreur :", error);
    renderGridError();
  }
};
allBtnFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    allBtnFilters.forEach((b) => b.classList.remove("bg-brand", "border-brand", "text-white"));
    btn.classList.add("bg-brand", "border-brand", "text-white");
    currentFilter = btn.getAttribute("data-type") || "all";
    loadCreatures();
  });
});
if (grid) {
  grid.addEventListener("click", (e) => {
    if (e.target.closest("#btn-retry-grid")) {
      loadCreatures();
    }
  });
}
loadCreatures();
