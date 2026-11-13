import { fromFormState, hasIngredient, isNote, normalize, toFormState } from "./ingredients";
import { missingFor } from "./cabinet";
import { alsoCovers, alsoFinds } from "./synonyms";

describe("normalize", () => {
  it("treats accents, hyphens, periods and curly apostrophes as the same", () => {
    expect(normalize("St-Germain")).toBe("st germain");
    expect(normalize("St. Germain")).toBe("st germain");
    expect(normalize("Peychaud’s")).toBe("peychaud's");
    expect(normalize("Añejo  Tequila ")).toBe("anejo tequila");
  });

  it("keeps decimal points", () => {
    expect(normalize("2.5 oz")).toBe("2.5 oz");
  });
});

describe("isNote", () => {
  it("treats Optional ingredients as ingredients", () => {
    expect(isNote("Optional: 1/2 oz simple syrup")).toBe(false);
    expect(hasIngredient(["2 oz vodka", "Optional: 1/2 oz Chambord"], "chambord")).toBe(true);
  });

  it("still treats optional garnishes and optional notes as notes", () => {
    expect(isNote("Optional: Garnish w 3 drops angostura bitters")).toBe(true);
    expect(isNote("Optional: Dry: less vermouth")).toBe(true);
    expect(isNote("Steps: blend")).toBe(true);
    expect(isNote("Note: Dirty: 1/2 oz olive brine")).toBe(true);
  });
});

describe("hasIngredient with synonyms", () => {
  const mojito = ["2 oz white rum", "3/4 oz lime juice", "Club soda (to top)"];
  const collins = ["2 oz gin", "1 oz lemon juice", "Soda water (To top)"];

  it("finds the same thing written differently, both ways", () => {
    expect(hasIngredient(collins, "club soda")).toBe(true);
    expect(hasIngredient(mojito, "soda water")).toBe(true);
    expect(hasIngredient(["1 dash aromatic bitters"], "angostura")).toBe(true);
    expect(hasIngredient(["1 dash aromatic bitters"], "angostura bitters")).toBe(true);
    expect(hasIngredient(["2 dashes Angostura bitters"], "aromatic bitters")).toBe(true);
    expect(hasIngredient(["1 oz light rum"], "white rum")).toBe(true);
    expect(hasIngredient(["2 oz. OJ"], "orange juice")).toBe(true);
  });

  it("finds brand names from the generic name and the reverse", () => {
    expect(hasIngredient(["1 oz ginger liqueur"], "domaine de canton ginger liqueur")).toBe(true);
    expect(hasIngredient(["1 oz Domaine de Canton ginger liqueur"], "ginger liqueur")).toBe(true);
    expect(hasIngredient(["1/2 oz St-Germain"], "elderflower liqueur")).toBe(true);
    expect(hasIngredient(["1/2 oz. St. Germain"], "st germain")).toBe(true);
  });

  it("a general name finds specific bottles, but not the other way round", () => {
    expect(hasIngredient(["1 oz Cointreau"], "orange liqueur")).toBe(true);
    expect(hasIngredient(["2 oz bourbon"], "whiskey")).toBe(true);
    expect(hasIngredient(["2 oz whiskey"], "bourbon")).toBe(false);
    expect(hasIngredient(["2 oz scotch"], "bourbon")).toBe(false);
  });

  it("does not over-match", () => {
    expect(hasIngredient(["2 oz bourbon"], "irish whiskey")).toBe(false);
    expect(hasIngredient(["4 oz hot water"], "club soda")).toBe(false);
  });
});

describe("synonyms", () => {
  it("lists what a search also finds", () => {
    expect(alsoFinds("orange liqueur").sort()).toEqual(["cointreau", "curacao", "grand marnier", "triple sec"]);
    expect(alsoFinds("gin")).toEqual([]);
  });

  it("lists what a bottle in My Bar also covers", () => {
    expect(alsoCovers("cointreau").sort()).toEqual(["orange liqueur", "triple sec"]);
    expect(alsoCovers("bourbon").sort()).toEqual(["whiskey", "whisky"]);
    expect(alsoCovers("orange liqueur")).toEqual([]);
    expect(alsoCovers("water")).toEqual([]);
  });

  it("My Bar uses the new synonyms", () => {
    const bar = { items: ["gin", "lemon", "soda water", "aromatic bitters"], basics: true };
    const drink = { _id: "x", ingredients: ["2 oz gin", "1 oz lemon juice", "Club soda (to top)", "1 dash Angostura bitters"] };
    expect(missingFor(drink, bar)).toEqual([]);
  });
});

describe("notes in the form", () => {
  const stored = ["1 oz rum", "Garnish: Lime wheel", "Note: Blend", "Note: Dirty: add 1/2 oz olive brine"];

  it("loads Note lines into the Notes box, keeping a note's own label", () => {
    expect(toFormState(stored)).toEqual({ rows: ["1 oz rum"], garnish: "Lime wheel", notes: "Blend\nDirty: add 1/2 oz olive brine" });
  });

  it("saves one Note line per line, after the garnish, and round-trips", () => {
    const { rows, garnish, notes } = toFormState(stored);
    expect(fromFormState(rows, garnish, notes)).toEqual(stored);
  });

  it("loads older Steps lines into the Notes box and saves them as Note lines", () => {
    const { rows, garnish, notes } = toFormState(["1 oz rum", "Steps: blend"]);
    expect(notes).toBe("blend");
    expect(fromFormState(rows, garnish, notes)).toEqual(["1 oz rum", "Note: blend"]);
  });

  it("skips blank lines and a typed Note: prefix", () => {
    expect(fromFormState(["1 oz rum"], "", "\n Note: shake \n\nstrain\n")).toEqual(["1 oz rum", "Note: shake", "Note: strain"]);
  });

  it("leaves notes that are still in ingredient rows where they are", () => {
    expect(toFormState(["2 oz gin", "Dry: less vermouth"]).rows).toEqual(["2 oz gin", "Dry: less vermouth"]);
  });

  it("works without notes, as before", () => {
    expect(fromFormState(["1 oz rum"], "")).toEqual(["1 oz rum"]);
  });
});
