const FILTER_KEY = "mondex_last_filter";

export const getSavedFilter = () => {
  return localStorage.getItem(FILTER_KEY) || "all";
};

export const saveFilter = (type) => {
  localStorage.setItem(FILTER_KEY, type);
};

const DRAFT_KEY = "mondex_creature_draft";



export const getDraft = () => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveDraft = (draftData) => {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
};

export const clearDraft = () => {
  sessionStorage.removeItem(DRAFT_KEY);
};
