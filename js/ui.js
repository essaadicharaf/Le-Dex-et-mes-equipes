const grid = document.querySelector("#grid");
const creatureCount = document.querySelector("#creature-count");

const getBadgeStyle = (type) => {
  if (type === "Data") return "border-blue-800 text-attribute-data";
  if (type === "Virus") return "border-red-800 text-attribute-virus";
  if (type === "Free") return "border-fuchsia-800 text-attribute-free";
  return "border-green-800 text-attribute-vaccine";
};

const createCardElement = (creature) => {
  const article = document.createElement("article");
  article.setAttribute("data-id", creature.id);
  article.className =
    "flex h-full flex-col justify-between gap-3 rounded-xl bg-surface p-3 pb-4 border-2 border-line shadow-md hover:-translate-y-1 hover:border-brand transition-all duration-200 cursor-pointer";

  const topBox = document.createElement("div");
  topBox.className = "flex flex-col gap-2 justify-between";

  const imgBox = document.createElement("div");
  imgBox.className =
    "relative flex h-54 w-full items-center justify-center rounded-xl bg-slate-300 border border-line/50 overflow-hidden p-1";

  const img = document.createElement("img");
  img.src = creature.image;
  img.alt = creature.name;
  img.className = "max-h-50 w-full object-cover rounded-lg pointer-events-none";

  const idBadge = document.createElement("span");
  idBadge.className = "absolute left-3 top-2 font-mono text-xs text-ink font-bold";
  idBadge.textContent = `#${String(creature.id).padStart(3, "0")}`;

  imgBox.append(img, idBadge);

  const headerRow = document.createElement("div");
  headerRow.className = "flex items-start justify-between gap-2";

  const title = document.createElement("h3");
  title.className = "font-display text-base font-bold text-ink leading-snug line-clamp-2";
  title.textContent = creature.name;

  const typeBadge = document.createElement("span");
  typeBadge.className = `shrink-0 rounded-full px-3 py-1 bg-white border ${getBadgeStyle(creature.type)} text-xs font-bold`;
  typeBadge.textContent = creature.type;

  headerRow.append(title, typeBadge);

  const levelText = document.createElement("p");
  levelText.className = "text-xs text-muted";
  levelText.textContent = `${creature.level} · Attaque ${creature.stats.attack}`;

  topBox.append(imgBox, headerRow, levelText);
  article.append(topBox);

  return article;
};

export const renderGrid = (creaturesList) => {
  if (!grid) return;
  grid.replaceChildren();

  if (creaturesList.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className =
      "col-span-full py-12 text-center text-ink bg-surface text-sm border-2 border-dashed border-line rounded-xl";
    emptyMsg.textContent = "Aucune créature trouvée.";
    grid.appendChild(emptyMsg);
    return;
  }

  creaturesList.forEach((creature) => {
    grid.appendChild(createCardElement(creature));
  });
};

export const renderGridLoading = () => {
  if (!grid) return;
  grid.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.className = "col-span-full flex flex-col items-center justify-center py-12 gap-3";

  const spinner = document.createElement("span");
  spinner.className = "w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin";

  const text = document.createElement("p");
  text.className = "text-xs font-semibold text-muted";
  text.textContent = "Chargement…";

  wrapper.append(spinner, text);
  grid.appendChild(wrapper);
};

export const renderGridError = () => {
  if (!grid) return;
  grid.replaceChildren();

  const box = document.createElement("div");
  box.className =
    "col-span-full py-12 text-center bg-surface border-2 border-dashed border-attribute-virus/50 rounded-xl flex flex-col items-center gap-3";

  const errorText = document.createElement("p");
  errorText.className = "text-attribute-virus font-bold text-sm";
  errorText.textContent = "Impossible de joindre l'API. Vérifiez que json-server est lancé sur le port 3000.";

  const retryBtn = document.createElement("button");
  retryBtn.type = "button";
  retryBtn.id = "btn-retry-grid";
  retryBtn.className = "btn-primary px-5 py-2 text-xs font-bold";
  retryBtn.textContent = "Réessayer";

  box.append(errorText, retryBtn);
  grid.appendChild(box);
};

export const updateCounter = (count) => {
  if (!creatureCount) return;
  creatureCount.textContent = String(count).padStart(2, "0");
};
