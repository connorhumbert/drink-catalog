// Common bottles by brand, each under the category it's best known for. People type brands into My Bar ("Tito's",
// "Maker's Mark"), and sometimes write them in recipes ("2 oz Bacardi"), so:
// - My Bar: a brand counts as its category and the reverse ("Tito's" covers vodka recipes; "vodka" covers "Tito's").
// - Search: the category also finds recipes that only name the brand ("whiskey" -> bourbon -> "Maker's Mark").
//   Searching a brand doesn't bring up every drink in its category.
// Write names lowercase without accents ("patron", not "Patrón"). Apostrophes are optional when matching, so
// "jack daniel's" also matches "jack daniels".
// Left out on purpose: brands that could mean two things (Luxardo: maraschino or cherries; Martini & Rossi, Dolin,
// Noilly Prat: sweet or dry vermouth; Pierre Ferrand: cognac or curaçao; Seagram's: gin or whiskey), Fireball (a
// cinnamon liqueur, not a whiskey to mix with) and names that are numbers (1800).
const BY_CATEGORY = {
  bourbon: [
    "maker's mark", "jim beam", "buffalo trace", "woodford reserve", "bulleit", "wild turkey", "knob creek",
    "four roses", "evan williams", "elijah craig", "basil hayden", "eagle rare", "old forester", "angel's envy",
  ],
  rye: ["rittenhouse", "whistlepig", "pikesville"],
  // Tennessee and Canadian whisk(e)y.
  whiskey: ["jack daniel's", "crown royal"],
  "irish whiskey": ["jameson", "bushmills", "tullamore", "redbreast", "teeling"],
  scotch: [
    "johnnie walker", "glenlivet", "glenfiddich", "monkey shoulder", "macallan", "dewar's", "laphroaig", "lagavulin",
    "chivas regal", "balvenie", "talisker",
  ],
  vodka: ["tito's", "smirnoff", "grey goose", "absolut", "ketel one", "belvedere", "stolichnaya", "stoli", "svedka", "deep eddy"],
  gin: ["tanqueray", "bombay sapphire", "hendrick's", "beefeater", "plymouth", "gordon's", "botanist", "roku"],
  rum: ["bacardi", "mount gay", "appleton", "plantation", "planteray", "havana club", "flor de cana", "diplomatico", "el dorado"],
  "dark rum": ["myers"],
  "black rum": ["gosling's"],
  "spiced rum": ["captain morgan", "sailor jerry", "kraken"],
  "coconut rum": ["malibu"],
  tequila: ["patron", "don julio", "jose cuervo", "espolon", "casamigos", "herradura", "milagro", "el jimador", "cazadores"],
  mezcal: ["del maguey"],
  cognac: ["hennessy", "remy martin", "courvoisier", "martell"],
  "irish cream": ["baileys", "bailey's"],
  "coffee liqueur": ["tia maria", "mr black"],
  "sweet vermouth": ["carpano antica"],
};

// "jack daniel's" -> ["jack daniel's", "jack daniels"], so a missing apostrophe still matches.
function withAndWithoutApostrophes(names) {
  return [...new Set(names.flatMap((name) => [name, name.replace(/'/g, "")]))];
}

export const BRANDS = Object.fromEntries(
  Object.entries(BY_CATEGORY).map(([category, names]) => [category, withAndWithoutApostrophes(names)])
);
