# Drink Catalog

A shared cocktail recipe app (Create React App, React 18, Firestore). There are no accounts: everyone sees and edits the same drinks. Users are mostly older family members on phone browsers, so keep the UI plain-language, with big tap targets and one job per screen.

## Commands
- `npm start`: dev server
- `CI=true npm test -- --watchAll=false`: run tests once
- `npm run build`: production build (also catches lint errors)
- Node version is in `.node-version`. The app version shown in the help sheet comes from `REACT_APP_VERSION` in `.env`.

## Layout
- `src/` root: `App.js` (routes), `index.js`, `service-worker.js` (must stay here for the build), `serviceWorkerRegistration.js`.
- `src/database/`: Firestore `drinks` collection with an offline cache (`firebase.js`, `drinksApi.js`). `useDrinks.js` holds the one live list shared by every screen. `saving.js`: what gets saved (`toDrinkData`), the conflict check and save error messages.
- `src/recipes/`: logic about recipe text, no UI.
  - `ingredients.js`: parses ingredient lines (amount, unit, name), `normalize()`, `hasIngredient()`, form ↔ stored conversion.
  - `synonyms.js`: the single synonym list used by search and My Bar. Add equivalents here, not in the data.
  - `search.js`: the search box: close matches on names and ingredients, synonyms, then whole-word matches in notes.
  - `suggestions.js` (glass and garnish ideas), `boozeTypes.js` (the booze categories).
- `src/screens/`: one folder per screen. `drinks/` (`DrinksTab.js`), `myBar/` (My Bar; `cabinet.js` is its saved list and "what you can make"), `addEdit/` (`AddDrink.js`, `EditDrink.js`, shared `DrinkForm.js` + `IngredientEditor.js`).
- `src/components/`: pieces used by several screens: `DrinkList.js` + `DrinkCard.js`, `StatusMessages.js`, `Navbar.js`, `TabBar.js`, `HelpSheet.js`.
- `src/hooks/`: `useOnline`, `useSessionState`.

## Ingredient data conventions
Each drink's `ingredients` field is an array of free-text lines. Don't make people use a fixed format; the code reads these conventions:
- `2 oz bourbon`: amount, then unit, then name. Text in parentheses is ignored by search.
- `Optional: …` is an optional ingredient. `Garnish: …` is the garnish line.
- `Note: …` lines (and older `Steps: …` lines) are the form's Notes box: steps, variations, tips. The card shows them under "Notes".
- Any other line with a colon outside parentheses (e.g. `Dry: less vermouth`) is also a note. Notes are skipped by My Bar and the "made with" filters; the search box matches them by whole words only.
- Prefer "generic word + brand" (`Domaine de Canton ginger liqueur`) and put a style before the spirit (`white rum`, `blanco tequila`).

## Rules
- **Never write to the Firestore database without the user's explicit approval of the exact changes.** Back up the `drinks` collection to `backups/` (gitignored) first, then verify the result afterward. The app has no auth, so any write affects everyone at once.
- Viewing works offline; **adding, editing and deleting need a connection.** They run as Firestore transactions (`src/database/drinksApi.js`), which fail offline instead of queueing, and editing checks nobody changed the drink since the form opened. Nothing writes offline. Don't reintroduce plain `addDoc`/`updateDoc`/`deleteDoc` (the one exception: `deleteDrink` repeats a successful delete locally so the list drops it at once). After saves and on returning to the app, `reconnect()` catches the live list up, because iPhones can leave the connection frozen. `useDrinks.js` restarts the live list if it stops with an error. Fresh data matters more than saving reads or offline polish: offline viewing is a minor case.
- New app versions install themselves (`skipWaiting` in `src/service-worker.js`). When one takes over an open page, `src/components/UpdateBanner.js` shows "Updating to the newest version…" and reloads, except on Add/Edit, where it waits until the person saves or leaves so typing isn't lost. That's only safe while the build is a single JS/CSS bundle, so avoid lazy-loaded chunks.
- New features must not block saving or rewrite what someone typed. Suggest with chips they can tap or ignore.
- Run the tests and a build before committing. Tests live next to the code (`*.test.js`).
- Every push to `main` bumps the minor version (`npm version minor --no-git-tag-version`, e.g. 0.5.0 → 0.6.0) in the same push.
