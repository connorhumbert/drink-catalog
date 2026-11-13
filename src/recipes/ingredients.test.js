import {
  buildSuggestions,
  fromFormState,
  garnishText,
  hasIngredient,
  ingredientName,
  isNote,
  isNoteLine,
  joinIngredient,
  normalize,
  noteLineText,
  splitIngredient,
  startsAWord,
  toFormState,
} from "./ingredients";

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

describe("splitIngredient and joinIngredient", () => {
  it("splits amount, unit and name, keeping notes in parentheses with the name", () => {
    expect(splitIngredient("1 1/2 oz rum (white)")).toEqual({ amount: "1 1/2", unit: "oz", name: "rum (white)" });
    expect(splitIngredient("2 dashes Angostura bitters")).toEqual({ amount: "2", unit: "dashes", name: "Angostura bitters" });
    expect(splitIngredient("1.5 oz gin")).toEqual({ amount: "1.5", unit: "oz", name: "gin" });
  });

  it("handles ranges, 'of', a trailing period and capitals in the unit", () => {
    expect(splitIngredient("2-3 dashes bitters")).toEqual({ amount: "2-3", unit: "dashes", name: "bitters" });
    expect(splitIngredient("1 to 2 oz simple syrup")).toEqual({ amount: "1 to 2", unit: "oz", name: "simple syrup" });
    expect(splitIngredient("2 oz. of gin")).toEqual({ amount: "2", unit: "oz", name: "gin" });
    expect(splitIngredient("1 Oz rum")).toEqual({ amount: "1", unit: "oz", name: "rum" });
  });

  it("leaves a number without a unit, and lines with no number, as they are", () => {
    expect(splitIngredient("3 mint leaves")).toEqual({ amount: "3", unit: "", name: "mint leaves" });
    expect(splitIngredient("Club soda (to top)")).toEqual({ amount: "", unit: "", name: "Club soda (to top)" });
    expect(splitIngredient("Optional: 1/2 oz Chambord")).toEqual({ amount: "", unit: "", name: "Optional: 1/2 oz Chambord" });
  });

  it("gives back exactly what was typed when joined again", () => {
    for (const line of ["1 1/2 oz rum (white)", "2 dashes Angostura bitters", "3 mint leaves", "Club soda (to top)", "1 to 2 oz simple syrup"]) {
      expect(joinIngredient(splitIngredient(line))).toBe(line);
    }
  });

  it("keeps the amount and unit when a suggestion replaces the name", () => {
    const { amount, unit } = splitIngredient("1 1/2 oz bourb");
    expect(joinIngredient({ amount, unit, name: "bourbon" })).toBe("1 1/2 oz bourbon");
    expect(joinIngredient({ amount: "", unit: "", name: "club soda" })).toBe("club soda");
  });
});

describe("ingredientName", () => {
  it("drops the amount, unit, parentheses and Optional label", () => {
    expect(ingredientName("1 1/4 oz rum (amber/dark)")).toBe("rum");
    expect(ingredientName("2 dashes Angostura bitters")).toBe("angostura bitters");
    expect(ingredientName("Optional: 1/2 oz Chambord")).toBe("chambord");
    expect(ingredientName("Club soda (to top)")).toBe("club soda");
    expect(ingredientName("3 mint leaves")).toBe("mint leaves");
  });

  it("falls back to the whole line when nothing would be left", () => {
    expect(ingredientName("(Shake well)")).toBe("(shake well)");
  });
});

describe("buildSuggestions", () => {
  const records = [
    { ingredients: ["2 oz gin", "1 oz lemon juice", "Garnish: Lemon twist", "Note: Shake"] },
    { ingredients: ["1.5 oz gin", "1 oz lime juice", "Dirty: olive brine", "muddle mint, lime and sugar"] },
    { name: "No ingredients yet" },
  ];

  it("lists ingredient names, most used first, skipping garnishes and notes", () => {
    expect(buildSuggestions(records)).toEqual(["gin", "lemon juice", "lime juice"]);
  });

  it("can drop names used only once", () => {
    expect(buildSuggestions(records, { minCount: 2 })).toEqual(["gin"]);
  });
});

describe("Note and Garnish lines", () => {
  it("recognizes Note and older Steps lines", () => {
    expect(isNoteLine("Note: Blend")).toBe(true);
    expect(isNoteLine("notes : shake hard")).toBe(true);
    expect(isNoteLine("Steps: blend")).toBe(true);
    expect(isNoteLine("Notebook: page 4")).toBe(false);
    expect(isNoteLine("Garnish: Lime wheel")).toBe(false);
    expect(isNoteLine("Dry: less vermouth")).toBe(false);
  });

  it("reads the text after the label", () => {
    expect(noteLineText("Note:  Shake well ")).toBe("Shake well");
    expect(noteLineText("Note: Dirty: add olive brine")).toBe("Dirty: add olive brine");
    expect(garnishText("Garnish: Lime wheel")).toBe("Lime wheel");
    expect(garnishText("garnish lime wheel")).toBe("lime wheel");
    expect(garnishText("Garnish:")).toBe("");
  });
});

describe("startsAWord", () => {
  it("matches the start of any word", () => {
    expect(startsAWord("fresh lemon juice", "lem")).toBe(true);
    expect(startsAWord("fresh lemon juice", "juice")).toBe(true);
    expect(startsAWord("fresh lemon juice", "emon")).toBe(false);
  });

  it("matches across a space or an apostrophe", () => {
    expect(startsAWord("peychaud's bitters", "peychaud's")).toBe(true);
    expect(startsAWord("peychaud's bitters", "peychaud's b")).toBe(true);
    expect(startsAWord("lemon juice", "lemon j")).toBe(true);
    expect(startsAWord("lemon juice", "lemon x")).toBe(false);
  });
});
