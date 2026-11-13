import { isBasic, missingById, missingFor, nextBottles } from "./cabinet";

const bar = (items, basics = true) => ({ items, basics });
const drink = (id, ingredients) => ({ _id: id, name: id, ingredients });

const kentuckyMule = drink("mule", ["2 oz rye/bourbon", "1/2 oz lime juice", "Optional: 1/2 oz simple syrup", "4 oz ginger beer"]);
const sufferingBastard = drink("bastard", [
  "1 oz bourbon",
  "1 oz london dry gin",
  "1/2 oz lime juice",
  "2 dashes angostura bitters",
  "Ginger beer (To top)",
  "Garnish: Mint sprig",
]);

describe("missingFor", () => {
  it("covers alternatives, plurals and skips Optional and Garnish lines", () => {
    expect(missingFor(kentuckyMule, bar(["bourbon", "limes", "ginger beer"]))).toEqual([]);
  });

  it("lists what's missing by ingredient name", () => {
    expect(missingFor(kentuckyMule, bar(["bourbon"]))).toEqual(["lime juice", "ginger beer"]);
  });

  it("matches whole words only, so gin does not cover ginger beer", () => {
    expect(missingFor(sufferingBastard, bar(["gin", "bourbon", "lime", "angostura bitters"]))).toEqual(["ginger beer"]);
  });

  it("a general bottle covers a specific line ('rum' covers 'dark rum')", () => {
    expect(missingFor(drink("x", ["2 oz dark rum"]), bar(["rum"]))).toEqual([]);
  });

  it("ignores accents and case", () => {
    expect(missingFor(drink("x", ["2 oz Tequila Añejo"]), bar(["tequila anejo"]))).toEqual([]);
  });

  it("assumes basics only when the toggle is on", () => {
    const toddy = drink("toddy", ["2 oz whiskey", "4 oz hot water", "1 tsp sugar", "Ice"]);
    expect(missingFor(toddy, bar(["whiskey"]))).toEqual([]);
    expect(missingFor(toddy, bar(["whiskey"], false))).toEqual(["hot water", "sugar", "ice"]);
  });

  it("skips note lines like substitutions and variations", () => {
    const moscowMule = drink("mule", ["2 oz vodka", "4 oz ginger beer", "Substitute vodka: gin, dark rum, bourbon"]);
    expect(missingFor(moscowMule, bar(["gin", "ginger beer"]))).toEqual(["vodka"]);
    const gimlet = drink("gimlet", ["2 oz gin", "3/4 oz lime juice", "(Variations to shake w/: cucumber, mint)"]);
    expect(missingFor(gimlet, bar(["gin", "lime"]))).toEqual([]);
    // A colon inside parentheses is still an ingredient.
    expect(missingFor(drink("x", ["1 oz crème de cacao (substitute: kahlua)"]), bar([]))).toEqual(["creme de cacao"]);
  });

  it("a specific bottle covers a generic line ('dry vermouth' covers 'vermouth')", () => {
    expect(missingFor(drink("martini", ["2 1/2 oz gin", "1/2 oz vermouth"]), bar(["gin", "dry vermouth"]))).toEqual([]);
  });

  it("knows common equivalents and ignores hyphens", () => {
    const kamikaze = drink("k", ["2 oz vodka", "3/4 oz orange liqueur", "1 oz st-germain"]);
    expect(missingFor(kamikaze, bar(["vodka", "cointreau", "St Germain"]))).toEqual([]);
    expect(missingFor(drink("x", ["2 oz whiskey"]), bar(["bourbon"]))).toEqual([]);
  });

  it("does not treat soda water or tonic water as a basic", () => {
    expect(isBasic("soda water")).toBe(false);
    expect(isBasic("tonic water")).toBe(false);
    expect(isBasic("hot water")).toBe(true);
  });
});

describe("nextBottles", () => {
  it("ranks the single ingredient that unlocks the most drinks", () => {
    const records = [
      drink("a", ["2 oz gin", "1 oz campari", "1 oz sweet vermouth"]),
      drink("b", ["1 oz campari", "1 oz sweet vermouth", "soda water"]),
      drink("c", ["2 oz gin", "1 oz lime juice"]),
      drink("d", ["2 oz gin", "1 oz chartreuse", "1 oz maraschino"]),
    ];
    const myBar = bar(["gin", "sweet vermouth", "soda water"]);
    expect(nextBottles(records, myBar)).toEqual([
      { name: "campari", count: 2 },
      { name: "lime juice", count: 1 },
    ]);
    expect(missingById(records, myBar).get("d")).toEqual(["chartreuse", "maraschino"]);
  });
});

describe("hasIngredient", () => {
  const { hasIngredient } = require("../../recipes/ingredients");
  it("ignores note lines", () => {
    const daiquiri = ["2 oz rum", "1 oz lime juice", "(Variations to shake w/: cucumber, mint)"];
    expect(hasIngredient(daiquiri, "mint")).toBe(false);
    expect(hasIngredient(daiquiri, "lime")).toBe(true);
  });
});
