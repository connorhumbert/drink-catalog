// Ingredient names that mean the same thing, and general names that cover specific bottles.
// Used by search on the Drinks tab and by My Bar, so recipes work however they were written.
// Write entries lowercase, without accents, hyphens or periods ("st germain", not "St-Germain").
// Brand names of spirits ("tito's" -> vodka) are in brands.js.
import { BRANDS } from "./brands";

// Same thing, different words. Searching any one finds them all, and having any one in My Bar covers the others.
const SAME = [
  ["whiskey", "whisky"],
  ["club soda", "soda water", "sparkling water"],
  ["angostura bitters", "angostura", "aromatic bitters"],
  ["blanco tequila", "silver tequila"],
  ["white rum", "light rum"],
  ["orange juice", "oj"],
  ["st germain", "elderflower liqueur"],
  ["kahlua", "coffee liqueur"],
  ["disaronno", "amaretto"],
  ["domaine de canton", "canton", "ginger liqueur"],
  ["cointreau", "triple sec"],
  ["frangelico", "hazelnut liqueur"],
  ["chambord", "raspberry liqueur"],
  ["tabasco", "hot sauce"],
  ["dark rum", "black rum"],
  ["peach schnapps", "peach liqueur"],
  ["amaro", "amari"],
];

// A general name and the specific bottles it includes. Other spellings of the general name (SAME above) share its list.
// Irish whiskey is listed so "whiskey" also finds recipes naming only an Irish brand (Jameson). Otherwise kinds whose
// names contain "whiskey"/"whisky" (Tennessee, Japanese) need no entry.
// - Search: the general name also finds the specific ones, but not the other way round, so searching "bourbon"
//   doesn't show every scotch drink.
// - My Bar: works both ways. Bourbon in the bar covers a recipe asking for "whiskey", and "whiskey" in the bar covers
//   a recipe asking for bourbon, the same way "rum" already covers "dark rum". People type the general name for what
//   they have.
const KINDS = {
  "orange liqueur": ["cointreau", "triple sec", "grand marnier", "curacao"],
  whiskey: ["bourbon", "rye", "scotch", "irish whiskey"],
  brandy: ["cognac", "armagnac"],
  // Italian bitter liqueurs. Campari and Aperol are left out: people call them aperitivi, not amari.
  amaro: ["fernet", "averna", "montenegro", "nonino", "cynar", "ramazzotti", "braulio", "lucano", "meletti"],
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
// Groups naming a whole category (whiskey/whisky, amaro/amari) only count on an exact match: "irish whiskey" is a kind
// of whiskey, not the same thing, so it mustn't pick up every other whiskey.
function sameAs(text) {
  return SAME.flatMap((group) => {
    const isCategory = group.some((name) => name in KINDS);
    const matches = isCategory ? group.includes(text) : group.some((name) => contains(text, name));
    return matches ? group : [];
  });
}

// `term` and its other spellings, matching exactly: "whisky" -> ["whiskey", "whisky"]. Not "irish whiskey" -> whiskey,
// or searching "irish whiskey" would find every bourbon drink.
function spellingsOf(term) {
  return SAME.find((group) => group.includes(term)) || [term];
}

// The specific bottles a general name includes, under any of its spellings: "whisky" -> ["bourbon", "rye", "scotch"].
function specificsOf(term) {
  return spellingsOf(term).flatMap((name) => KINDS[name] || []);
}

// Brands of a category, under any of its spellings: "dark rum" -> Myers's (dark rum) and Gosling's (black rum).
function brandsOf(category) {
  return spellingsOf(category).flatMap((name) => BRANDS[name] || []);
}

// Categories of the brand named in `item`: "tito's handmade vodka" -> ["vodka"]. `item` must already be normalized.
export function brandCategories(item) {
  return Object.keys(BRANDS).filter((category) => BRANDS[category].some((brand) => contains(item, brand)));
}

// Is `term` exactly one of the names above? The search box only adds synonym matches then, so typing "canton" finds
// every ginger liqueur drink but typing the drink name "Canton Breeze" doesn't. `term` must already be normalized.
export function isSynonymName(term) {
  return term in KINDS || term in BRANDS || SAME.some((group) => group.includes(term));
}

// Extra names a search for `term` should also find: other words for it, the specific bottles it includes, and their
// brands ("whiskey" -> "bourbon" -> "maker's mark"). `term` must already be normalized.
export function alsoFinds(term) {
  const found = new Set(sameAs(term));
  const add = (name) => {
    found.add(name);
    sameAs(name).forEach((other) => found.add(other));
  };
  brandsOf(term).forEach(add);
  for (const specific of specificsOf(term)) {
    add(specific);
    brandsOf(specific).forEach(add);
  }
  found.delete(term);
  return [...found];
}

// Extra names that having `item` in My Bar covers: "cointreau" -> ["triple sec", "orange liqueur"],
// "whiskey" -> ["bourbon", "rye", "scotch"]. `item` must already be normalized.
export function alsoCovers(item) {
  const covered = new Set(sameAs(item));
  alsoFinds(item).forEach((name) => covered.add(name));
  // A brand counts as its category: "tito's" covers whatever "vodka" covers.
  for (const category of brandCategories(item)) {
    covered.add(category);
    alsoCovers(category).forEach((name) => covered.add(name));
  }
  const names = [item, ...covered];
  for (const [general, specifics] of Object.entries(KINDS)) {
    if (names.some((name) => specifics.some((specific) => contains(name, specific)))) {
      spellingsOf(general).forEach((name) => covered.add(name));
    }
  }
  covered.delete(item);
  return [...covered];
}
