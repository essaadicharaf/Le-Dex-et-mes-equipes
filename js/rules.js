const types = ["Vaccine", "Data", "Virus", "Free"];
const levels = ["Rookie", "Champion", "Ultimate", "Mega"];
const isValidStat = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 255;
};
const isValidHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};
export const validateCreature = (data) => {
  const errors = {};
  const cleanName = String(data.name || "").trim();
  if (cleanName.length < 2) {
    errors.name = "Le nom est obligatoire (2 caractères minimum).";
  }
  if (!types.includes(data.type)) {
    errors.type = "Veuillez choisir un attribut valide.";
  }
  if (!levels.includes(data.level)) {
    errors.level = "Veuillez choisir un niveau.";
  }
  const cleanImage = String(data.image || "").trim();
  if (!isValidHttpUrl(cleanImage)) {
    errors.image = "Veuillez saisir une URL d'image valide (https://…).";
  }
  if (!isValidStat(data.stats?.attack)) {
    errors.attack = "La puissance doit être un entier entre 1 et 255.";
  }
  if (!isValidStat(data.stats?.defence)) {
    errors.defence = "La défense doit être un entier entre 1 et 255.";
  }
  if (!isValidStat(data.stats?.speed)) {
    errors.speed = "La vitesse doit être un entier entre 1 et 255.";
  }
  const cleanDesc = String(data.description || "").trim();
  if (cleanDesc.length < 10 || cleanDesc.length > 200) {
    errors.description = "La description doit contenir entre 10 et 200 caractères.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
