import { GLASSES, suggestGarnishes, suggestGlass } from "./suggestions";

describe("suggestGlass", () => {
  it("needs at least two ingredients", () => {
    expect(suggestGlass([], "Gin")).toBe("");
    expect(suggestGlass(["2 oz gin"], "Gin")).toBe("");
  });

  it("guesses from what's in the drink", () => {
    expect(suggestGlass(["2 oz whiskey", "4 oz hot water", "1 tbsp honey"], "Whiskey/Rye/Bourbon")).toBe("Heat-proof mug");
    expect(suggestGlass(["2 oz vodka", "4 oz ginger beer", "1/2 oz lime juice"], "Vodka")).toBe("Copper mug");
    expect(suggestGlass(["1 oz gin", "1/2 oz lemon juice", "3 oz champagne"], "Gin")).toBe("Flute");
    expect(suggestGlass(["2 oz gin", "4 oz tonic"], "Gin")).toBe("Highball");
    expect(suggestGlass(["2 oz rum", "3 oz pineapple juice", "1 oz cream of coconut"], "Rum")).toBe("Hurricane");
    expect(suggestGlass(["1 oz gin", "1 oz Campari", "1 oz sweet vermouth"], "Gin")).toBe("Rocks");
    expect(suggestGlass(["2 oz rum", "1 oz lime juice", "3/4 oz simple syrup"], "Rum")).toBe("Coupe");
    expect(suggestGlass(["2 oz bourbon", "1/4 oz simple syrup", "2 dashes bitters"], "Whiskey/Rye/Bourbon")).toBe("Rocks");
  });

  it("serves vermouth drinks in a Martini glass only for gin and vodka", () => {
    expect(suggestGlass(["2 oz gin", "1 oz dry vermouth"], "Gin")).toBe("Martini");
    expect(suggestGlass(["2 oz rye", "1 oz sweet vermouth", "2 dashes bitters"], "Whiskey/Rye/Bourbon")).toBe("Coupe");
  });

  it("gives no guess when nothing fits", () => {
    expect(suggestGlass(["2 oz vodka", "1 oz kahlua"], "Vodka")).toBe("");
  });

  it("only suggests glasses from the list", () => {
    const guess = suggestGlass(["2 oz gin", "4 oz tonic"], "Gin");
    expect(GLASSES).toContain(guess);
  });
});

describe("suggestGarnishes", () => {
  it("suggests garnishes that go with the ingredients", () => {
    expect(suggestGarnishes(["2 oz rum", "1 oz lime juice", "8 mint leaves"], [])).toEqual(["Lime wedge", "Lime wheel", "Mint sprig"]);
  });

  it("adds garnishes used more than once in other drinks, without repeats", () => {
    const records = [
      { ingredients: ["2 oz bourbon", "Garnish: Orange slice, cherry"] },
      { ingredients: ["2 oz rye", "Garnish: Cherry"] },
      { ingredients: ["2 oz gin", "Garnish: Lemon twist"] },
      { name: "No ingredients yet" },
    ];
    expect(suggestGarnishes(["2 oz rye", "1 oz sweet vermouth"], records)).toEqual(["Cherry"]);
    expect(suggestGarnishes(["2 oz vodka", "4 oz water"], records)).toEqual(["Cherry"]);
  });

  it("stops at the maximum", () => {
    expect(suggestGarnishes(["lime", "lemon", "orange", "mint"], [], 3)).toEqual(["Lime wedge", "Lime wheel", "Lemon twist"]);
  });
});
