import { alsoFinds, wholeWord } from "./synonyms";

const UNITS =
  "oz|ounces?|ml|cl|tsp|teaspoons?|tbsp|tablespoons?|cups?|dash(?:es)?|drops?|bar ?spoons?|parts?|splash(?:es)?|slices?|wedges?|sprigs?|leaves|leaf|cubes?|pinch(?:es)?|scoops?|shots?|jiggers?|whole";

const QUANTITY = /^[\d./\s-]+(?:to\s+[\d./]+\s*)?/;
const UNIT = new RegExp(`^(?:${UNITS})\\b\\.?\\s*(?:of\\s+)?`, "i");

export function isGarnish(raw) {
  return /^garnish\b/i.test(raw.trim());
}

const OPTIONAL = /^optional\s*:\s*/i;

// Notes rather than ingredients: "Substitute vodka: gin, rum", "Dirty: 1/2 oz olive brine", "(Variations to shake w/: mint)".
// A colon inside parentheses is still an ingredient: "1 oz crème de cacao (substitute: kahlua)".
// "Optional: 1/2 oz simple syrup" is an ingredient, so search finds it. "Optional: Garnish w bitters" is not.
export function isNote(raw) {
  const text = raw.trim();
  const optional = text.match(OPTIONAL);
  if (optional) {
    const rest = text.slice(optional[0].length);
    return isGarnish(rest) || isNote(rest);
  }
  return text.startsWith("(") || text.replace(/\([^)]*\)?/g, "").includes(":");
}

// "Note: Shake with ice" lines hold the drink's notes: steps, variations, tips. They're kept in the ingredient list so
// the database doesn't need a new field, and older copies of the app still show them. Older "Steps:" lines count too.
const NOTE_LINE = /^\s*(?:notes?|steps?)\s*:\s*/i;

export function isNoteLine(raw) {
  return NOTE_LINE.test(raw);
}

export function noteLineText(raw) {
  return raw.replace(NOTE_LINE, "").trim();
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

// For comparing names: lowercase, no accents, straight apostrophes, hyphens as spaces and no trailing periods, so
// "Añejo" = "anejo", "St-Germain" = "St. Germain" = "st germain" and "Peychaud’s" = "peychaud's".
export function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[-‐-―]/g, " ")
    .replace(/\.(?=\s|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// For suggestion boxes: does a word in `name` start with `typed`? Both must already be normalized. Typing across a
// space or an apostrophe also counts ("peychaud's" matches "peychaud's bitters", "lemon j" matches "lemon juice").
export function startsAWord(name, typed) {
  return name.split(/[^a-z0-9]+/).some((word) => word.startsWith(typed)) || ` ${name}`.includes(` ${typed}`);
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Does any ingredient contain the tag at the start of a word? ("rum" matches "dark rum", not "crumb")
// Also finds synonyms: "club soda" finds "soda water", "orange liqueur" finds "cointreau".
export function hasIngredient(ingredients, tag) {
  const term = normalize(tag);
  const patterns = [new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}`), ...alsoFinds(term).map(wholeWord)];
  return (ingredients || []).some((item) => {
    if (isGarnish(item) || isNote(item)) return false;
    const name = normalize(ingredientName(item));
    return patterns.some((pattern) => pattern.test(name));
  });
}

// Ingredient names across all drinks, most common first, for autocomplete.
// minCount drops names used only once, which are often recipe notes ("muddle mint in shaker") rather than ingredients.
export function buildSuggestions(records, { minCount = 1 } = {}) {
  const counts = new Map();
  for (const record of records) {
    for (const item of record.ingredients || []) {
      if (isGarnish(item) || isNote(item)) continue;
      const name = ingredientName(item);
      // Skip notes and substitution lines that aren't a single ingredient.
      if (/[:,~]/.test(name) || name.length > 32) continue;
      counts.set(name, (counts.get(name) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= minCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
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

// Stored list -> form state: one raw line per ingredient row, one garnish string, and the notes one per line.
export function toFormState(ingredients) {
  const list = Array.isArray(ingredients) ? ingredients : Object.values(ingredients || {});
  return {
    rows: list.filter((item) => !isGarnish(item) && !isNoteLine(item)).map((item) => item.trim()),
    garnish: list.filter(isGarnish).map(garnishText).filter(Boolean).join(", "),
    notes: list.filter(isNoteLine).map(noteLineText).filter(Boolean).join("\n"),
  };
}

// Form state -> stored list: ingredients, then a "Garnish:" line, then one "Note:" line per line of notes.
export function fromFormState(rows, garnish, notes = "") {
  const list = rows.map((row) => row.trim()).filter(Boolean);
  const garnishLine = garnish.trim();
  if (garnishLine) list.push(`Garnish: ${garnishLine}`);
  notes
    .split("\n")
    .map(noteLineText)
    .filter(Boolean)
    .forEach((note) => list.push(`Note: ${note}`));
  return list;
}
