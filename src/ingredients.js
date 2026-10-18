const UNITS =
  "oz|ounces?|ml|cl|tsp|teaspoons?|tbsp|tablespoons?|cups?|dash(?:es)?|drops?|barspoons?|parts?|splash(?:es)?|slices?|wedges?|sprigs?|leaves|leaf|cubes?|pinch(?:es)?|scoops?|shots?|jiggers?|whole";

const QUANTITY = /^[\d./\s-]+(?:to\s+[\d./]+\s*)?/;
const UNIT = new RegExp(`^(?:${UNITS})\\b\\.?\\s*(?:of\\s+)?`, "i");

export function isGarnish(raw) {
  return /^garnish\b/i.test(raw.trim());
}

// "1 1/4 oz rum (amber/dark)" -> "rum". Falls back to the raw text if nothing is left.
export function ingredientName(raw) {
  const cleaned = raw
    .replace(/\([^)]*\)?/g, "")
    .replace(/^\s*optional:\s*/i, "")
    .replace(QUANTITY, "")
    .replace(UNIT, "")
    .trim()
    .toLowerCase();
  return cleaned || raw.trim().toLowerCase();
}

// Lowercase and strip accents so "añejo" matches "anejo".
export function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Does any ingredient contain the tag at the start of a word? ("rum" matches "dark rum", not "crumb")
export function hasIngredient(ingredients, tag) {
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalize(tag))}`);
  return (ingredients || []).some((item) => !isGarnish(item) && pattern.test(normalize(ingredientName(item))));
}

// Ingredient names across all drinks, most common first, for autocomplete.
export function buildSuggestions(records) {
  const counts = new Map();
  for (const record of records) {
    for (const item of record.ingredients || []) {
      if (isGarnish(item)) continue;
      const name = ingredientName(item);
      counts.set(name, (counts.get(name) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
}
