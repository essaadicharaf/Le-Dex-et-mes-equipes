const grid = document.querySelector("#grid");
const creatureCount = document.querySelector("#creature-count");
const detailPanel = document.querySelector("#detail");

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

// ===================== DETAIL PANEL =====================

const createStatRow = (label, value, barColorClass) => {
  const safeValue = Number(value) || 0;
  const percent = Math.min(100, Math.round((safeValue / 255) * 100));

  const row = document.createElement("div");
  row.className = "grid grid-cols-[70px_1fr_40px] items-center gap-2";

  const labelSpan = document.createElement("span");
  labelSpan.className = "font-bold text-ink";
  labelSpan.textContent = label;

  const track = document.createElement("div");
  track.className = "h-2.5 rounded-full bg-ground overflow-hidden border border-line";

  const bar = document.createElement("div");
  bar.className = `h-full rounded-full ${barColorClass}`;
  bar.style.width = `${percent}%`;
  track.appendChild(bar);

  const valueSpan = document.createElement("span");
  valueSpan.className = "text-right font-mono font-bold text-ink";
  valueSpan.textContent = safeValue;

  row.append(labelSpan, track, valueSpan);
  return row;
};

export const renderDetailLoading = () => {
  if (!detailPanel) return;

  detailPanel.className =
    "flex flex-col items-center justify-center text-center gap-3 rounded-xl border-2 border-dashed border-line bg-surface p-8 min-h-[360px] shadow-sm w-full";

  const spinner = document.createElement("div");
  spinner.className = "w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin";

  const text = document.createElement("p");
  text.className = "text-xs font-semibold text-muted";
  text.textContent = "Chargement…";

  detailPanel.replaceChildren(spinner, text);
};

export const renderDetailNotFound = () => {
  if (!detailPanel) return;

  detailPanel.className =
    "flex flex-col items-center justify-center text-center gap-4 rounded-xl border-2 border-dashed border-line bg-surface p-8 min-h-[360px] shadow-sm w-full";

  const title = document.createElement("h3");
  title.className = "font-display text-base font-bold text-ink";
  title.textContent = "Créature introuvable";

  const text = document.createElement("p");
  text.className = "text-xs text-muted max-w-[220px]";
  text.textContent = "Ce Digimon n'existe pas ou a été supprimé.";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.id = "btn-close-detail";
  closeBtn.className = "btn-outline px-4 py-2 text-xs font-bold";
  closeBtn.textContent = "Fermer";

  detailPanel.replaceChildren(title, text, closeBtn);
};

export const renderDetailError = (creatureId) => {
  if (!detailPanel) return;

  detailPanel.className =
    "flex flex-col items-center justify-center text-center gap-4 rounded-xl border-2 border-dashed border-attribute-virus bg-surface p-8 min-h-[360px] shadow-sm w-full";

  const title = document.createElement("h3");
  title.className = "font-display text-base font-bold text-attribute-virus";
  title.textContent = "Erreur de chargement";

  const text = document.createElement("p");
  text.className = "text-xs text-muted max-w-[220px]";
  text.textContent = "Impossible de contacter le serveur.";

  const retryBtn = document.createElement("button");
  retryBtn.type = "button";
  retryBtn.id = "btn-retry-detail";
  retryBtn.setAttribute("data-id", creatureId);
  retryBtn.className = "btn-primary px-4 py-2 text-xs font-bold";
  retryBtn.textContent = "Réessayer";

  detailPanel.replaceChildren(title, text, retryBtn);
};

export const renderDetail = (creature) => {
  if (!detailPanel) return;

  detailPanel.className = "flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 shadow-sm w-full";

  const header = document.createElement("div");
  header.className = "flex items-center justify-between";

  const displayId = String(creature.id).startsWith("#") ? creature.id : `#${String(creature.id).padStart(3, "0")}`;

  const idSpan = document.createElement("span");
  idSpan.className = "font-mono text-sm text-muted font-bold";
  idSpan.textContent = `${displayId} · Détail`;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.id = "btn-close-detail";
  closeBtn.setAttribute("aria-label", "Fermer le détail");
  closeBtn.className =
    "btn-outline w-8 h-8 flex items-center justify-center p-0 rounded-lg text-muted hover:text-ink hover:bg-line transition-colors";
  closeBtn.textContent = "✕";

  header.append(idSpan, closeBtn);

  const imgBox = document.createElement("div");
  imgBox.className =
    "flex h-auto w-full items-center justify-center rounded-xl bg-slate-300 border border-line/40 overflow-hidden";

  const img = document.createElement("img");
  img.src = creature.image;
  img.alt = creature.name;
  img.className = "rounded-xl h-full w-full object-cover p-1 pointer-events-none";
  imgBox.appendChild(img);

  const titleRow = document.createElement("div");
  titleRow.className = "flex items-center justify-between";

  const nameHeading = document.createElement("h2");
  nameHeading.className = "font-display text-2xl font-extrabold text-ink";
  nameHeading.textContent = creature.name;

  const badge = document.createElement("span");
  badge.className = `rounded-full px-3 py-1 bg-white border ${getBadgeStyle(creature.type)} text-xs font-bold`;
  badge.textContent = creature.type;

  titleRow.append(nameHeading, badge);

  const levelP = document.createElement("p");
  levelP.className = "text-xs text-muted font-semibold";
  levelP.textContent = creature.level || "";

  const descP = document.createElement("p");
  descP.className = "text-xs text-muted leading-relaxed text-left";
  descP.textContent = creature.description || "";

  const statsContainer = document.createElement("div");
  statsContainer.className = "flex flex-col gap-2.5 text-xs pt-2";

  const atk = creature.stats?.attack ?? 0;
  const def = creature.stats?.defence ?? creature.stats?.defense ?? 0;
  const spd = creature.stats?.speed ?? 0;

  statsContainer.append(
    createStatRow("Puissance", atk, "bg-brand"),
    createStatRow("Défense", def, "bg-attribute-data"),
    createStatRow("Vitesse", spd, "bg-attribute-vaccine"),
  );

  const addTeamBtn = document.createElement("button");
  addTeamBtn.type = "button";
  addTeamBtn.setAttribute("data-action", "add-team");
  addTeamBtn.setAttribute("data-id", creature.id);
  addTeamBtn.className = "btn-primary w-full py-2.5 text-sm font-bold mt-2";
  addTeamBtn.textContent = "Ajouter à l'équipe";

  detailPanel.replaceChildren(header, imgBox, titleRow, levelP, descP, statsContainer, addTeamBtn);
};

export const resetDetail = () => {
  if (!detailPanel) return;

  detailPanel.className =
    "flex flex-col items-center justify-center text-center gap-4 rounded-xl border-2 border-dashed border-line bg-surface p-8 min-h-[360px] shadow-sm w-full";

  const iconWrapper = document.createElement("div");
  iconWrapper.className = "w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "w-8 h-8");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");

  const path1 = document.createElementNS(svgNS, "path");
  path1.setAttribute("stroke-linecap", "round");
  path1.setAttribute("stroke-linejoin", "round");
  path1.setAttribute("stroke-width", "2");
  path1.setAttribute("d", "M15 12a3 3 0 11-6 0 3 3 0 016 0z");

  const path2 = document.createElementNS(svgNS, "path");
  path2.setAttribute("stroke-linecap", "round");
  path2.setAttribute("stroke-linejoin", "round");
  path2.setAttribute("stroke-width", "2");
  path2.setAttribute(
    "d",
    "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  );

  svg.append(path1, path2);
  iconWrapper.appendChild(svg);

  const textBox = document.createElement("div");

  const heading = document.createElement("h3");
  heading.className = "font-display text-base font-bold text-ink";
  heading.textContent = "Aucun Digimon sélectionné";

  const paragraph = document.createElement("p");
  paragraph.className = "text-xs text-muted m-1 max-w-[220px]";
  paragraph.textContent = "Cliquez sur une carte de la grille pour afficher ses détails et ses statistiques.";

  textBox.append(heading, paragraph);
  detailPanel.replaceChildren(iconWrapper, textBox);
};
