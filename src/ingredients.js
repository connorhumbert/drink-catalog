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
      // Skip notes and substitution lines that aren't a single ingredient.
      if (/[:,]/.test(name) || name.length > 32) continue;
      counts.set(name, (counts.get(name) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
}

const UNIT_CAPTURE = new RegExp(`^(${UNITS})\\b\\.?\\s*(?:of\\s+)?`, "i");

// "1 1/2 oz rum (white)" -> { amount: "1 1/2", unit: "oz", name: "rum (white)" }. Lines with no leading number keep everything in name.
export function splitIngredient(raw) {
  const text = raw.trim();
  const quantity = text.match(QUANTITY);
  if (!quantity || !/\d/.test(quantity[0])) return { amount: "", unit: "", name: text };
  const rest = text.slice(quantity[0].length);
  const unit = rest.match(UNIT_CAPTURE);
  return {
    amount: quantity[0].trim(),
    unit: unit ? unit[1].toLowerCase() : "",
    name: unit ? rest.slice(unit[0].length).trim() : rest.trim(),
  };
}

export function joinIngredient({ amount, unit, name }) {
  return [amount, unit, name].map((part) => (part || "").trim()).filter(Boolean).join(" ");
}

export function garnishText(raw) {
  return raw.replace(/^\s*garnish\s*:?\s*/i, "").trim();
}

// Stored list -> form state: one raw line per ingredient row plus one garnish string.
export function toFormState(ingredients) {
  const list = Array.isArray(ingredients) ? ingredients : Object.values(ingredients || {});
  return {
    rows: list.filter((item) => !isGarnish(item)).map((item) => item.trim()),
    garnish: list.filter(isGarnish).map(garnishText).filter(Boolean).join(", "),
  };
}

// Form state -> stored list (garnish goes last as a "Garnish:" line).
export function fromFormState(rows, garnish) {
  const list = rows.map((row) => row.trim()).filter(Boolean);
  const garnishLine = garnish.trim();
  if (garnishLine) list.push(`Garnish: ${garnishLine}`);
  return list;
}
