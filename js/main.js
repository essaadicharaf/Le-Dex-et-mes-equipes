import { createCreature, deleteCreature, getCreatureById, getCreatures, updateCreature } from "./api.js";
import { validateCreature } from "./rules.js";
import { clearDraft, getDraft, getSavedFilter, saveDraft, saveFilter } from "./storage.js";
import {
  clearFormErrors,
  renderDetail,
  renderDetailError,
  renderDetailLoading,
  renderDetailNotFound,
  renderFormErrors,
  renderFormFeedback,
  renderGrid,
  renderGridError,
  renderGridLoading,
  resetDetail,
  setFormMode,
  updateCounter,
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
let editingCreatureId = null;
let searchTimer = null;
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
    clearTimeout(searchTimer);
    currentSearch = searchInput ? searchInput.value.trim() : "";
    loadCreatures();
  });
}
if (searchInput) {
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentSearch = searchInput.value.trim();
      loadCreatures();
    }, 250);
  });
}
if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    clearTimeout(searchTimer);
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
    // edit creature from card
    const editCartBtn = e.target.closest('[data-action="edit-creature"]');
    if (editCartBtn) {
      startEditCreature(editCartBtn.getAttribute("data-id"));
      return;
    }
    // delete creature from card
    const deleteCardBtn = e.target.closest('[data-action="delete-creature"]');
    if (deleteCardBtn) {
      handleDeleteCreature(
        deleteCardBtn.getAttribute("data-id"),
        deleteCardBtn.getAttribute("data-name"),
        deleteCardBtn,
      );
      return;
    }
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
      return;
    }
    // edit creature from detail panel
    const editDetailBtn = e.target.closest('[data-action="edit-creature"]');
    if (editDetailBtn) {
      startEditCreature(editDetailBtn.getAttribute("data-id"));
      return;
    }
    // delete creature from detail panel
    const deleteDetailBtn = e.target.closest('[data-action="delete-creature"]');
    if (deleteDetailBtn) {
      handleDeleteCreature(
        deleteDetailBtn.getAttribute("data-id"),
        deleteDetailBtn.getAttribute("data-name"),
        deleteDetailBtn,
      );
    }
  });
}
updateActiveFilterUI();
loadCreatures();
// ===================== FORMULAIRE =====================
const createSection = document.querySelector("#create");
const creatureForm = document.querySelector("#creature-form");
const inputName = document.querySelector("#input-name");
const inputType = document.querySelector("#input-type");
const inputLevel = document.querySelector("#input-level");
const inputImage = document.querySelector("#input-image");
const inputAttack = document.querySelector("#input-attack");
const inputDefence = document.querySelector("#input-defence");
const inputSpeed = document.querySelector("#input-speed");
const inputDescription = document.querySelector("#input-description");
const submitBtn = document.querySelector("#btn-submit-creature");
const getFormRawValues = () => ({
  name: inputName.value,
  type: inputType.value,
  level: inputLevel.value,
  image: inputImage.value,
  attack: inputAttack.value,
  defence: inputDefence.value,
  speed: inputSpeed.value,
  description: inputDescription.value,
});
const restoreDraft = () => {
  const draft = getDraft();
  if (!draft) return;
  inputName.value = draft.name || "";
  inputType.value = draft.type || "";
  inputLevel.value = draft.level || "";
  inputImage.value = draft.image || "";
  inputAttack.value = draft.attack || "";
  inputDefence.value = draft.defence || "";
  inputSpeed.value = draft.speed || "";
  inputDescription.value = draft.description || "";
};
const parseStat = (input) => {
  const raw = input.value.trim();
  return raw === "" ? NaN : Number(raw);
};
// fill form inputs for edit mode
const fillFormWithCreature = (creature) => {
  inputName.value = creature.name || "";
  inputType.value = creature.type || "";
  inputLevel.value = creature.level || "";
  inputImage.value = creature.image || "";
  inputAttack.value = creature.stats?.attack ?? "";
  inputDefence.value = creature.stats?.defence ?? "";
  inputSpeed.value = creature.stats?.speed ?? "";
  inputDescription.value = creature.description || "";
};
// load creature and switch form to edit mode
const startEditCreature = async (creatureId) => {
  try {
    const creature = await getCreatureById(creatureId);
    editingCreatureId = creature.id;
    fillFormWithCreature(creature);
    clearFormErrors();
    renderFormFeedback();
    setFormMode(true, creature.name);
    (createSection || creatureForm)?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Erreur edit load :", error);
    renderFormFeedback("Impossible de charger la créature à modifier.", "error");
  }
};
// confirm and delete creature with DELETE /creatures/:id
const handleDeleteCreature = async (creatureId, creatureName = "", triggerBtn = null) => {
  const label = creatureName ? `« ${creatureName} »` : `#${creatureId}`;
  const isConfirmed = window.confirm(`Voulez-vous vraiment supprimer le Digimon ${label} ?`);
  if (!isConfirmed) return;

  if (triggerBtn) {
    triggerBtn.disabled = true;
    triggerBtn.textContent = "Suppression…";
  }

  try {
    await deleteCreature(creatureId);

    const openedDetailBtn = detailPanel?.querySelector('[data-action="delete-creature"]');
    if (openedDetailBtn && openedDetailBtn.getAttribute("data-id") === String(creatureId)) {
      resetDetail();
    }

    if (editingCreatureId !== null && String(editingCreatureId) === String(creatureId)) {
      editingCreatureId = null;
      creatureForm?.reset();
      setFormMode(false);
    }

    renderFormFeedback(`Le Digimon ${label} a été supprimé avec succès !`, "success");
    await loadCreatures();
  } catch (error) {
    console.error("Erreur suppression :", error);
    renderFormFeedback("Impossible de supprimer la créature. Vérifiez que json-server est lancé.", "error");
    if (triggerBtn) {
      triggerBtn.disabled = false;
      triggerBtn.textContent = "Supprimer";
    }
  }
};
if (creatureForm) {
  restoreDraft();
  creatureForm.addEventListener("input", () => {
    if (editingCreatureId !== null) return;
    saveDraft(getFormRawValues());
  });
  creatureForm.addEventListener("change", () => {
    if (editingCreatureId !== null) return;
    saveDraft(getFormRawValues());
  });
  creatureForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newCreature = {
      name: inputName.value.trim(),
      type: inputType.value,
      level: inputLevel.value,
      image: inputImage.value.trim(),
      description: inputDescription.value.trim(),
      stats: {
        attack: parseStat(inputAttack),
        defence: parseStat(inputDefence),
        speed: parseStat(inputSpeed),
      },
    };
    const { isValid, errors } = validateCreature(newCreature);
    if (!isValid) {
      renderFormErrors(errors);
      renderFormFeedback("Veuillez corriger les champs invalides avant l'envoi.", "error");
      return;
    }
    clearFormErrors();
    renderFormFeedback("");
    const isEditing = editingCreatureId !== null;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = isEditing ? "Enregistrement..." : "Envoi…";
    }
    try {
      if (isEditing) {
        const updatedCreature = await updateCreature(editingCreatureId, newCreature);
        creatureForm.reset();
        editingCreatureId = null;
        setFormMode(false);
        clearFormErrors();
        renderFormFeedback(`Le Digimon « ${updatedCreature.name} » a été modifié avec succès !`, "success");
        await loadCreatures();
        renderDetail(updatedCreature);
        return;
      }
      const createdCreature = await createCreature(newCreature);
      clearDraft();
      creatureForm.reset();
      clearFormErrors();
      renderFormFeedback(`Le Digimon « ${createdCreature.name} » a été ajouté avec succès !`, "success");
      await loadCreatures();
      renderDetail(createdCreature);
    } catch (error) {
      console.error("Erreur soumission :", error);
      const actionLabel = isEditing ? "modifier" : "ajouter";
      renderFormFeedback(`Impossible de ${actionLabel} la créature. Vérifiez que json-server est lancé.`, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = editingCreatureId !== null ? "Enregistrer les modifications" : "Ajouter le Digimon";
      }
    }
  });
  creatureForm.addEventListener("reset", () => {
    if (editingCreatureId !== null) {
      editingCreatureId = null;
      setFormMode(false);
    } else {
      clearDraft();
    }
    clearFormErrors();
    renderFormFeedback("");
  });
}
