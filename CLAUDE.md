# Drink Catalog

A shared cocktail recipe app (Create React App, React 18, Firestore). There are no accounts: everyone sees and edits the same drinks. Users are mostly older family members on phone browsers, so keep the UI plain-language, with big tap targets and one job per screen.

## Commands
- `npm start`: dev server
- `CI=true npm test -- --watchAll=false`: run tests once
- `npm run build`: production build (also catches lint errors)
- Node version is in `.node-version`. The app version shown in the help sheet comes from `REACT_APP_VERSION` in `.env`.

## Layout
- `src/drinksApi.js`, `src/firebase.js`: Firestore `drinks` collection, with an offline cache (IndexedDB). `useDrinks.js` holds the one live list shared by every screen.
- `src/ingredients.js`: parses ingredient lines (amount, unit, name), `normalize()`, `hasIngredient()` for search, and form ↔ stored conversion.
- `src/synonyms.js`: the single synonym list used by both search and My Bar. Add equivalents here, not in the data.
- `src/cabinet.js`: My Bar (saved in localStorage on the device) and "what you can make".
- `src/suggestions.js`: glass and garnish suggestions in the form.
- `src/search.js`: the search box: close matches on names and ingredients, synonyms, then whole-word matches in notes.
- `src/components/`: `recordList.js` (Drinks tab), `DrinkForm.js` + `IngredientEditor.js` (add and edit), `DrinkCard.js`.

## Ingredient data conventions
Each drink's `ingredients` field is an array of free-text lines. Don't make people use a fixed format; the code reads these conventions:
- `2 oz bourbon`: amount, then unit, then name. Text in parentheses is ignored by search.
- `Optional: …` is an optional ingredient. `Garnish: …` is the garnish line.
- `Note: …` lines (and older `Steps: …` lines) are the form's Notes box: steps, variations, tips. The card shows them under "Notes".
- Any other line with a colon outside parentheses (e.g. `Dry: less vermouth`) is also a note. Notes are skipped by My Bar and the "made with" filters; the search box matches them by whole words only.
- Prefer "generic word + brand" (`Domaine de Canton ginger liqueur`) and put a style before the spirit (`white rum`, `blanco tequila`).

## Rules
- **Never write to the Firestore database without the user's explicit approval of the exact changes.** Back up the `drinks` collection to `backups/` (gitignored) first, then verify the result afterward. The app has no auth, so any write affects everyone at once.
- New features must not block saving or rewrite what someone typed. Suggest with chips they can tap or ignore.
- Run the tests and a build before committing. Tests live next to the code (`*.test.js`).
