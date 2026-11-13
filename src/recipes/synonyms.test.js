import { alsoCovers, alsoFinds, isSynonymName, wholeWord } from "./synonyms";
import { missingFor } from "../screens/myBar/cabinet";

describe("wholeWord", () => {
  it("matches whole words only", () => {
    expect(wholeWord("rye").test("bourbon or rye")).toBe(true);
    expect(wholeWord("rye").test("rye whiskey")).toBe(true);
    expect(wholeWord("rye").test("ryeberry")).toBe(false);
    expect(wholeWord("rye").test("dryer")).toBe(false);
  });

  it("treats punctuation in the word literally", () => {
    expect(wholeWord("st. germain").test("st. germain")).toBe(true);
    expect(wholeWord("st. germain").test("stx germain")).toBe(false);
  });
});

describe("isSynonymName", () => {
  it("is true only for a name on the list, not text that contains one", () => {
    expect(isSynonymName("canton")).toBe(true);
    expect(isSynonymName("orange liqueur")).toBe(true);
    expect(isSynonymName("whiskey")).toBe(true);
    expect(isSynonymName("canton breeze")).toBe(false);
    expect(isSynonymName("gin")).toBe(false);
  });

  it("is false for a specific bottle that only a general name covers", () => {
    expect(isSynonymName("bourbon")).toBe(false);
  });
});

describe("synonyms", () => {
  it("lists what a search also finds", () => {
    expect(alsoFinds("orange liqueur").sort()).toEqual(["cointreau", "curacao", "grand marnier", "triple sec"]);
    expect(alsoFinds("whiskey").sort()).toEqual(["bourbon", "rye", "scotch"]);
    expect(alsoFinds("canton").sort()).toEqual(["domaine de canton", "ginger liqueur"]);
    expect(alsoFinds("gin")).toEqual([]);
  });

  it("finds the whole group when the text contains a name from it", () => {
    expect(alsoFinds("domaine de canton ginger liqueur").sort()).toEqual(["canton", "domaine de canton", "ginger liqueur"]);
  });

  it("lists what a bottle in My Bar also covers", () => {
    expect(alsoCovers("cointreau").sort()).toEqual(["orange liqueur", "triple sec"]);
    expect(alsoCovers("triple sec").sort()).toEqual(["cointreau", "orange liqueur"]);
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
