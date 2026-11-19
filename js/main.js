import { getCreatures, getCreatureById } from "./api.js";
import { getSavedFilter, saveFilter } from "./storage.js";
import {
  renderGrid,
  renderGridError,
  renderGridLoading,
  updateCounter,
  renderDetail,
  resetDetail,
  renderDetailLoading,
  renderDetailNotFound,
  renderDetailError,
} from "./ui.js";

const grid = document.querySelector("#grid");
const detailPanel = document.querySelector("#detail");
const allBtnFilters = document.querySelectorAll("#filters button");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search");
const clearSearchBtn = document.querySelector("#btn-clear-search");
const sortSelect = document.querySelector("#sort-select");

let currentFilter = getSavedFilter();
let currentSearch = "";
let currentSort = "id";
let currentOrder = "asc";

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
      sort: currentSort,
      order: currentOrder,
    });
    updateCounter(creatures.length);
    renderGrid(creatures);
  } catch (error) {
    console.error("Erreur :", error);
    renderGridError();
  }
};

const openDetail = async (creatureId) => {
  renderDetailLoading();
  try {
    const creature = await getCreatureById(creatureId);
    renderDetail(creature);
  } catch (error) {
    console.error("Erreur détail :", error);
    if (error.status === 404) {
      renderDetailNotFound();
    } else {
      renderDetailError(creatureId);
    }
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

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    const [sortField, sortOrder] = sortSelect.value.split("-");
    currentSort = sortField;
    currentOrder = sortOrder;
    loadCreatures();
  });
}

if (grid) {
  grid.addEventListener("click", (e) => {
    if (e.target.closest("#btn-retry-grid")) {
      loadCreatures();
      return;
    }

    if (e.target.closest('[data-action="add-team"]')) return;

    const card = e.target.closest("article");
    if (!card) return;

    const creatureId = card.getAttribute("data-id");
    openDetail(creatureId);
  });
}

if (detailPanel) {
  detailPanel.addEventListener("click", (e) => {
    if (e.target.closest("#btn-close-detail")) {
      resetDetail();
      return;
    }

    const retryBtn = e.target.closest("#btn-retry-detail");
    if (retryBtn) {
      const creatureId = retryBtn.getAttribute("data-id");
      openDetail(creatureId);
    }
  });
}

updateActiveFilterUI();
loadCreatures();
