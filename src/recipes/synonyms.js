// Ingredient names that mean the same thing, and general names that cover specific bottles.
// Used by search on the Drinks tab and by My Bar, so recipes work however they were written.
// Write entries lowercase, without accents, hyphens or periods ("st germain", not "St-Germain").

// Same thing, different words. Searching any one finds them all, and having any one in My Bar covers the others.
const SAME = [
  ["club soda", "soda water"],
  ["angostura bitters", "angostura", "aromatic bitters"],
  ["blanco tequila", "silver tequila"],
  ["white rum", "light rum"],
  ["orange juice", "oj"],
  ["st germain", "elderflower liqueur"],
  ["kahlua", "coffee liqueur"],
  ["disaronno", "amaretto"],
  ["domaine de canton", "canton", "ginger liqueur"],
  ["cointreau", "triple sec"],
];

// A general name and the specific bottles it includes.
// - Search: the general name also finds the specific ones, but not the other way round, so searching "bourbon"
//   doesn't show every scotch drink.
// - My Bar: works both ways. Bourbon in the bar covers a recipe asking for "whiskey", and "whiskey" in the bar covers
//   a recipe asking for bourbon, the same way "rum" already covers "dark rum". People type the general name for what
//   they have.
const KINDS = {
  "orange liqueur": ["cointreau", "triple sec", "grand marnier", "curacao"],
  whiskey: ["bourbon", "rye", "scotch"],
  whisky: ["bourbon", "rye", "scotch"],
  brandy: ["cognac", "armagnac"],
  "sparkling wine": ["prosecco", "champagne", "cava"],
};

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Matches `word` as whole words, so "rye" is found in "bourbon or rye" but not in "ryeberry".
export function wholeWord(word) {
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(word)}(?![a-z0-9])`);
}

const contains = (text, word) => wholeWord(word).test(text);

// Every name in each SAME group that `text` mentions, so "domaine de canton ginger liqueur" also finds plain
// "ginger liqueur": "angostura bitters" -> ["angostura bitters", "angostura", "aromatic bitters"].
function sameAs(text) {
  return SAME.flatMap((group) => (group.some((name) => contains(text, name)) ? group : []));
}

// Is `term` exactly one of the names above? The search box only adds synonym matches then, so typing "canton" finds
// every ginger liqueur drink but typing the drink name "Canton Breeze" doesn't. `term` must already be normalized.
export function isSynonymName(term) {
  return term in KINDS || SAME.some((group) => group.includes(term));
}

// Extra names a search for `term` should also find. `term` must already be normalized.
export function alsoFinds(term) {
  const found = new Set(sameAs(term));
  for (const specific of KINDS[term] || []) {
    found.add(specific);
    sameAs(specific).forEach((name) => found.add(name));
  }
  found.delete(term);
  return [...found];
}

// Extra names that having `item` in My Bar covers: "cointreau" -> ["triple sec", "orange liqueur"],
// "whiskey" -> ["bourbon", "rye", "scotch"]. `item` must already be normalized.
export function alsoCovers(item) {
  const covered = new Set(sameAs(item));
  alsoFinds(item).forEach((name) => covered.add(name));
  const names = [item, ...covered];
  for (const [general, specifics] of Object.entries(KINDS)) {
    if (names.some((name) => specifics.some((specific) => contains(name, specific)))) covered.add(general);
  }
  covered.delete(item);
  return [...covered];
}
