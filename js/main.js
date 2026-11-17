import { getCreatures } from "./api.js";
import { getSavedFilter, saveFilter } from "./storage.js";
import { renderGrid, renderGridError, renderGridLoading, updateCounter } from "./ui.js";
const grid = document.querySelector("#grid");
const allBtnFilters = document.querySelectorAll("#filters button");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search");
const clearSearchBtn = document.querySelector("#btn-clear-search");
let currentFilter = getSavedFilter();
let currentSearch = "";

const updateActiveFilterUI = () => {
  allBtnFilters.forEach((btn) => {
    const btnType = btn.getAttribute("data-type") || "all";
    if (btnType === currentFilter) {
      btn.classList.add("bg-brand", "border-brand", "text-white");
    } else {
      btn.classList.remove("bg-brand", "border-brand", "text-white");
    }
  });
};
const loadCreatures = async () => {
  renderGridLoading();
  try {
    const creatures = await getCreatures({
      type: currentFilter,
      q: currentSearch,
    });
    updateCounter(creatures.length);
    renderGrid(creatures);
  } catch (error) {
    console.error("Erreur :", error);
    renderGridError();
  }
};

allBtnFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.getAttribute("data-type") || "all";
    saveFilter(currentFilter);
    updateActiveFilterUI();
    loadCreatures();
  });
});
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    currentSearch = searchInput ? searchInput.value.trim() : "";
    loadCreatures();
  });
}
if (searchInput) {
  searchInput.addEventListener("input", () => {
    currentSearch = searchInput.value.trim();
    loadCreatures();
  });
}
if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    currentSearch = "";
    loadCreatures();
  });
}
if (grid) {
  grid.addEventListener("click", (e) => {
    if (e.target.closest("#btn-retry-grid")) {
      loadCreatures();
    }
  });
}
updateActiveFilterUI();
loadCreatures();
