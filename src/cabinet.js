import { useEffect, useState } from "react";
import { ingredientName, isGarnish, isNote, normalize } from "./ingredients";

// The user's bar lives only on this device. There are no accounts, so it can't be tied to anyone in Firestore.
const STORAGE_KEY = "myBar";
const EMPTY_BAR = { items: [], basics: true };

// Things nearly everyone has, assumed in stock when "basics" is on. Matched against the whole ingredient name.
export const BASICS_LABEL = "ice, water, sugar, simple syrup and salt";
const BASICS = /^(?:crushed |cubed |shaved )?ice(?: cubes?)?$|^(?:hot |cold |boiling |warm )?water$|^(?:white |granulated |caster )?sugar(?: cubes?)?$|^simple syrup$|^(?:kosher |sea )?salt$/;

export function isBasic(name) {
  return BASICS.test(clean(name));
}

function readBar() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.items)) return { items: saved.items, basics: saved.basics !== false };
  } catch (error) {
    // Missing or unreadable, start empty.
  }
  return EMPTY_BAR;
}

// [bar, setBar] like useState, saved to localStorage and kept in sync across tabs.
export function useCabinet() {
  const [bar, setBar] = useState(readBar);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bar));
    } catch (error) {
      console.error("Couldn't save My Bar:", error);
    }
  }, [bar]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setBar(readBar());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return [bar, setBar];
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Lowercase, no accents, hyphens as spaces ("St-Germain" = "st germain").
function clean(text) {
  return normalize(text).replace(/[-‐–]/g, " ").replace(/\s+/g, " ").trim();
}

// Having the key also counts as having these. Kept short: common bottles that recipes name generically.
const ALSO_COVERS = {
  cointreau: ["orange liqueur", "triple sec"],
  "triple sec": ["orange liqueur", "cointreau"],
  "grand marnier": ["orange liqueur"],
  curacao: ["orange liqueur"],
  bourbon: ["whiskey", "whisky"],
  rye: ["whiskey", "whisky"],
  scotch: ["whiskey", "whisky"],
  "st germain": ["elderflower liqueur"],
  "elderflower liqueur": ["st germain"],
  prosecco: ["sparkling wine"],
  champagne: ["sparkling wine"],
  cava: ["sparkling wine"],
  "soda water": ["club soda"],
  "club soda": ["soda water"],
  kahlua: ["coffee liqueur"],
  "coffee liqueur": ["kahlua"],
};

// Whole-word match that tolerates a plural: "lime" and "limes" both cover "lime juice", but "gin" doesn't cover "ginger beer".
function wordPattern(text) {
  const stem = /ss$/.test(text) ? text : text.replace(/s$/, "");
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(stem)}s?(?![a-z0-9])`);
}

// Ingredient names a drink actually needs: no garnish, "Optional:" or note lines.
function requiredNames(ingredients) {
  return (ingredients || [])
    .filter((item) => !isGarnish(item) && !/^\s*optional\b/i.test(item) && !isNote(item))
    .map((item) => clean(ingredientName(item.replace(/^\s*[~≈]\s*/, ""))))
    .filter(Boolean);
}

// Builds a function that returns the ingredient names a drink still needs from this bar.
export function makeMissingFinder(bar) {
  const have = new Set();
  for (const item of bar.items) {
    const name = clean(item);
    if (!name) continue;
    have.add(name);
    (ALSO_COVERS[name] || []).forEach((alias) => have.add(alias));
  }
  const items = [...have];
  const patterns = items.map(wordPattern);
  // Covered when a bar item appears in the line ("rum" covers "dark rum")
  // or the line appears in a bar item ("dry vermouth" covers "vermouth").
  const covered = (name) => {
    if (bar.basics && isBasic(name)) return true;
    if (patterns.some((pattern) => pattern.test(name))) return true;
    const linePattern = wordPattern(name);
    return items.some((item) => linePattern.test(item));
  };
  return (record) => requiredNames(record.ingredients).filter((name) => !covered(name));
}

export function missingFor(record, bar) {
  return makeMissingFinder(bar)(record);
}

// Map of drink id -> missing ingredient names.
export function missingById(records, bar) {
  const find = makeMissingFinder(bar);
  return new Map(records.map((record) => [record._id, find(record)]));
}

// Ingredients that would each complete the most "one away" drinks, best first: [{ name, count }].
export function nextBottles(records, bar, max = 3) {
  const missing = missingById(records, bar);
  const counts = new Map();
  for (const names of missing.values()) {
    if (names.length === 1) counts.set(names[0], (counts.get(names[0]) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([name, count]) => ({ name, count }));
}
