const FILTER_KEY = "mondex_last_filter";

export const getSavedFilter = () => {
  return localStorage.getItem(FILTER_KEY) || "all";
};

export const saveFilter = (type) => {
  localStorage.setItem(FILTER_KEY, type);
};
