# Mon Dex connecté — Digimon

Application web responsive de gestion d'un encyclopédie numérique dédiée à l'univers **Digimon**, connectée à une API REST locale via `json-server`.
Projet réalisé dans le cadre du **Sprint 3 — Brief 2 : Le Dex et mes équipes**.

---

## Univers & Source des données

- **Univers choisi :** Digimon
- **Attributs supportés :** `Vaccine`, `Data`, `Virus`, `Free`
- **Niveaux d'évolution :** `Rookie`, `Champion`, `Ultimate`, `Mega`
- **Base de données locale :** `db.json` (12 Digimon de départ)
- **Source des visuels :** [Digimon Public Database / Shadowsmith](https://digimon.shadowsmith.com/)

---

## Fonctionnalités implémentées

### Partie 1 — Catalogue connecté à l'API

- **Affichage dynamique (`GET /creatures`) :** Génération de la grille des créatures (numéro, image, nom, attribut, niveau et attaque) avec gestion de l'état de chargement (`Chargement…`) et message d'erreur clair si le serveur est arrêté.
- **Filtrage par attribut (`?type=`) :** Filtrage instantané par type (`Tous`, `Vaccine`, `Data`, `Virus`, `Free`).
- **Recherche combinée (`?q=`) :** Recherche par mot-clé fonctionnant simultanément avec le filtre actif, avec affichage d'un message dédié lorsqu'aucun résultat ne correspond.
- **Persistance du filtre (`localStorage`) :** Mémorisation du dernier attribut sélectionné et restauration automatique au rechargement de la page.

### Partie 2 — Tri, fiche détaillée & création

- **Tri dynamique (`_sort` & `_order`) :** Tri par numéro (`001 → 012`) ou par nom (`A → Z` et `Z → A`) combiné à la recherche et au filtre actifs.
- **Fiche détaillée (`GET /creatures/:id`) :** Affichage au clic sur une carte de l'image, de l'attribut, du niveau, de la description et des barres de statistiques (Puissance, Défense, Vitesse), avec gestion de l'erreur `404` (_Créature introuvable_).
- **Ajout d'une créature (`POST /creatures`) :** Formulaire complet vérifié avant envoi par la fonction pure `validateCreature(data)` (nom obligatoire, attribut et niveau valides, URL image valide, statistiques entre `1` et `255`, description entre `10` et `200` caractères) avec messages d'erreur sous chaque champ invalide.
- **Brouillon automatique (`sessionStorage`) :** Sauvegarde de la saisie en cours pendant la session, restaurée après un rechargement (`F5`) et effacée après ajout réussi ou fermeture de l'onglet.

### Partie 3 — Modification, suppression & finition

- **Modification (`PUT /creatures/:id`) :** Ouverture du formulaire pré-rempli avec les données du Digimon sélectionné et application des mêmes règles de validation.
- **Suppression (`DELETE /creatures/:id`) :** Suppression sécurisée après demande de confirmation utilisateur.
- **États d'interface & synchronisation :** Désactivation des boutons (`disabled`) pendant les requêtes réseau, affichage de messages de succès ou d'erreur, et rechargement automatique de la grille en conservant la recherche, le filtre et le tri actifs.

---

## Architecture du projet

```text
Le-Dex-et-mes-equipes/
├── index.html          # Structure HTML5 sémantique et responsive (360px → 1440px)
├── db.json             # Base de données JSON locale (12 créatures Digimon)
├── package.json        # Scripts npm et dépendances (json-server@0.17.4, Tailwind CSS v4)
├── tailwind.config.js  # Palette de couleurs personnalisée et breakpoints
├── dist/
│   ├── input.css       # Directives Tailwind CSS v4 et classes composants
│   └── output.css      # Feuille de style compilée et minifiée
├── js/
│   ├── api.js          # Appels HTTP centralisés (request, GET, POST, PUT, DELETE)
│   ├── rules.js        # Logique pure de validation (validateCreature) sans accès DOM
│   ├── storage.js      # Gestion du localStorage (filtre) et sessionStorage (brouillon)
│   ├── ui.js           # Rendu DOM sécurisé (createElement / textContent) et états UI
│   └── main.js         # Point d'entrée, écouteurs d'événements et coordination des modules
└── README.md           # Documentation complète du projet
```

---

## Installation & Lancement

1. **Cloner le dépôt :**

   ```bash
   git clone [https://github.com/essaadicharaf/Le-Dex-et-mes-equipes.git](https://github.com/essaadicharaf/Le-Dex-et-mes-equipes.git)
   cd Le-Dex-et-mes-equipes
   ```

2. **Installer les dépendances :**

   ```bash
   npm install
   ```

3. **Compiler le CSS Tailwind :**

   ```bash
   npm run build
   ```

4. **Démarrer le serveur API (`http://localhost:3000`) :**

   ```bash
   npm run api
   ```

   _(Garder ce terminal ouvert pendant l'utilisation de l'application.)_

5. **Ouvrir l'application :**
   Lancer `index.html` via un serveur local (ex. extension **Live Server** sur VS Code).

---

## Routes API utilisées

| Méthode  | Endpoint         | Description                                                          |
| :------- | :--------------- | :------------------------------------------------------------------- |
| `GET`    | `/creatures`     | Récupérer la liste (supporte `?type=`, `?q=`, `&_sort=`, `&_order=`) |
| `GET`    | `/creatures/:id` | Récupérer la fiche détaillée d'un Digimon                            |
| `POST`   | `/creatures`     | Créer un nouveau Digimon                                             |
| `PUT`    | `/creatures/:id` | Modifier un Digimon existant                                         |
| `DELETE` | `/creatures/:id` | Supprimer un Digimon                                                 |

---

## Auteur

- **Développeur :** ESSAADI Charaf Eddine
- **Formation :** YouCode Safi — Développement Web
