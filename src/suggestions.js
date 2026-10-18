import { garnishText, isGarnish, normalize } from "./ingredients";

export const GLASSES = [
  "Rocks",
  "Coupe",
  "Martini",
  "Nick & Nora",
  "Highball",
  "Collins",
  "Copper mug",
  "Flute",
  "Wine glass",
  "Tiki mug",
  "Hurricane",
  "Shot",
  "Heat-proof mug",
];

// Best guess at the glass from what's in the drink, or "" when nothing fits.
export function suggestGlass(ingredients, booze) {
  const text = normalize(ingredients.join(" "));
  if (ingredients.length < 2) return "";
  const has = (pattern) => pattern.test(text);
  const hasCitrusJuice = has(/juice|muddled/);

  if (has(/hot water|boiling water|hot coffee|hot tea/)) return "Heat-proof mug";
  if (has(/ginger beer/)) return "Copper mug";
  if (has(/prosecco|champagne|sparkling wine|cava|presecco/)) return "Flute";
  if (has(/tonic|club soda|soda water|sparkling water|ginger ale|grapefruit soda|cola/)) return "Highball";
  if (booze === "Rum" && has(/pineapple|coconut|passion|orgeat/)) return "Hurricane";
  if (has(/espresso/)) return "Martini";
  if (has(/campari|aperol/) && has(/vermouth/)) return "Rocks";
  if (has(/egg white|cream|milk/) || hasCitrusJuice) return "Coupe";
  if (has(/vermouth/)) return booze === "Gin" || booze === "Vodka" ? "Martini" : "Coupe";
  if (has(/bitters|syrup|agave/)) return "Rocks";
  return "";
}

const GARNISH_RULES = [
  [/lime/, ["Lime wedge", "Lime wheel"]],
  [/lemon/, ["Lemon twist", "Lemon wheel"]],
  [/orange/, ["Orange twist", "Orange slice"]],
  [/grapefruit/, ["Grapefruit twist"]],
  [/mint/, ["Mint sprig"]],
  [/pineapple/, ["Pineapple wedge"]],
  [/vermouth/, ["Cherry"]],
  [/cream/, ["Grated nutmeg"]],
  [/coffee|espresso/, ["Coffee beans"]],
];

// Most common garnish phrases across existing drinks ("Orange slice, cherry" counts as two).
function commonGarnishes(records) {
  const counts = new Map();
  for (const record of records) {
    for (const item of record.ingredients || []) {
      if (!isGarnish(item)) continue;
      for (const part of garnishText(item).split(/[,/]/)) {
        const name = part.trim().toLowerCase();
        if (name) counts.set(name, (counts.get(name) || 0) + 1);
      }
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1));
}

export function suggestGarnishes(ingredients, records, max = 8) {
  const text = normalize(ingredients.join(" "));
  const picks = [];
  const add = (name) => {
    if (!picks.some((p) => p.toLowerCase() === name.toLowerCase())) picks.push(name);
  };
  GARNISH_RULES.forEach(([pattern, names]) => {
    if (pattern.test(text)) names.forEach(add);
  });
  commonGarnishes(records).forEach(add);
  return picks.slice(0, max);
}
