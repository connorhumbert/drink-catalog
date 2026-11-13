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
    expect(isSynonymName("ginger beer")).toBe(false);
  });

  it("is true for a spirit with brands on the list", () => {
    expect(isSynonymName("gin")).toBe(true);
    expect(isSynonymName("bourbon")).toBe(true);
  });
});

describe("synonyms", () => {
  it("lists what a search also finds", () => {
    expect(alsoFinds("orange liqueur").sort()).toEqual(["cointreau", "curacao", "grand marnier", "triple sec"]);
    expect(alsoFinds("whiskey")).toEqual(expect.arrayContaining(["bourbon", "rye", "scotch", "whisky"]));
    expect(alsoFinds("whisky")).toEqual(expect.arrayContaining(["bourbon", "rye", "scotch", "whiskey"]));
    expect(alsoFinds("canton").sort()).toEqual(["domaine de canton", "ginger liqueur"]);
    expect(alsoFinds("lime juice")).toEqual([]);
  });

  it("finds the whole group when the text contains a name from it", () => {
    expect(alsoFinds("domaine de canton ginger liqueur").sort()).toEqual(["canton", "domaine de canton", "ginger liqueur"]);
  });

  it("lists what a bottle in My Bar also covers", () => {
    expect(alsoCovers("cointreau").sort()).toEqual(["orange liqueur", "triple sec"]);
    expect(alsoCovers("triple sec").sort()).toEqual(["cointreau", "orange liqueur"]);
    expect(alsoCovers("bourbon")).toEqual(expect.arrayContaining(["whiskey", "whisky", "maker's mark"]));
    expect(alsoCovers("orange liqueur").sort()).toEqual(["cointreau", "curacao", "grand marnier", "triple sec"]);
    expect(alsoCovers("whiskey")).toEqual(expect.arrayContaining(["bourbon", "rye", "scotch", "whisky"]));
    expect(alsoCovers("brandy")).toEqual(expect.arrayContaining(["armagnac", "cognac", "hennessy"]));
    expect(alsoCovers("cognac")).toEqual(expect.arrayContaining(["brandy", "hennessy"]));
    expect(alsoCovers("water")).toEqual([]);
  });

  it("My Bar uses the new synonyms", () => {
    const bar = { items: ["gin", "lemon", "soda water", "aromatic bitters"], basics: true };
    const drink = { _id: "x", ingredients: ["2 oz gin", "1 oz lemon juice", "Club soda (to top)", "1 dash Angostura bitters"] };
    expect(missingFor(drink, bar)).toEqual([]);
  });
});

describe("brand names and other words for the same thing", () => {
  it("amaro finds Fernet Branca, Averna and the plural 'amari'", () => {
    expect(alsoFinds("amaro")).toEqual(expect.arrayContaining(["amari", "fernet", "averna", "nonino"]));
    expect(alsoFinds("amaro")).not.toContain("campari");
    expect(isSynonymName("amaro")).toBe(true);
  });

  it("brands find their generic names and the reverse", () => {
    expect(alsoFinds("hazelnut liqueur")).toEqual(["frangelico"]);
    expect(alsoFinds("chambord")).toEqual(["raspberry liqueur"]);
    expect(alsoFinds("hot sauce")).toEqual(["tabasco"]);
  });

  it("knows a few more words for the same thing", () => {
    expect(alsoFinds("dark rum")).toEqual(expect.arrayContaining(["black rum", "myers", "gosling's"]));
    expect(alsoFinds("peach liqueur")).toEqual(["peach schnapps"]);
    expect(alsoFinds("club soda").sort()).toEqual(["soda water", "sparkling water"]);
  });

  it("in My Bar, Fernet covers a recipe asking for amaro, and amaro covers Fernet", () => {
    expect(alsoCovers("fernet branca")).toEqual(expect.arrayContaining(["amaro"]));
    expect(alsoCovers("amaro")).toEqual(expect.arrayContaining(["fernet", "amari"]));
  });
});

describe("whiskey spellings", () => {
  it("whiskey and whisky find each other and the same bottles", () => {
    expect(isSynonymName("whisky")).toBe(true);
    expect(alsoFinds("whisky")).toEqual(expect.arrayContaining(["whiskey", "bourbon"]));
  });

  it("a specific whiskey doesn't pull in every other kind", () => {
    expect(alsoFinds("irish whiskey")).not.toContain("bourbon");
    expect(alsoFinds("irish whiskey")).not.toContain("whiskey");
    expect(alsoFinds("irish whiskey")).toContain("jameson");
  });

  it("in My Bar, bourbon covers both spellings", () => {
    expect(alsoCovers("bourbon")).toEqual(expect.arrayContaining(["whiskey", "whisky"]));
    expect(alsoCovers("bourbon")).not.toContain("scotch");
  });
});

describe("brands", () => {
  it("a category finds its brands, with or without the apostrophe", () => {
    expect(alsoFinds("vodka")).toEqual(expect.arrayContaining(["tito's", "titos", "grey goose"]));
    expect(alsoFinds("whiskey")).toEqual(expect.arrayContaining(["maker's mark", "jack daniels", "jameson", "johnnie walker"]));
    expect(alsoFinds("irish cream")).toEqual(expect.arrayContaining(["baileys", "bailey's"]));
  });

  it("a brand doesn't find every drink in its category", () => {
    expect(alsoFinds("tito's")).toEqual([]);
    expect(isSynonymName("tito's")).toBe(false);
  });

  it("in My Bar, a brand counts as its category", () => {
    expect(alsoCovers("tito's")).toContain("vodka");
    expect(alsoCovers("titos handmade vodka")).toContain("vodka");
    expect(alsoCovers("maker's mark")).toEqual(expect.arrayContaining(["bourbon", "whiskey"]));
    expect(alsoCovers("jack daniels")).toEqual(expect.arrayContaining(["whiskey", "bourbon", "rye"]));
    expect(alsoCovers("baileys")).toContain("irish cream");
  });
});
