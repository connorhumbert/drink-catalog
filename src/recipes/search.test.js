import { searchByText } from "./search";

const drink = (name, ingredients, booze = "Gin") => ({ _id: name, name, booze, ingredients });

const records = [
  drink("Canton Breeze", ["1 oz dark rum", "1 oz Domaine de Canton ginger liqueur", "1 oz pineapple juice"], "Rum"),
  drink("Ginger Gold Rush", ["1 1/2 oz bourbon", "1 oz Domaine de Canton ginger liqueur", "1/2 oz lemon juice"], "Whiskey/Rye/Bourbon"),
  drink("Prospector’s Smash", ["2 oz bourbon", "1/4 oz ginger liqueur", "3/4 oz lemon juice"], "Whiskey/Rye/Bourbon"),
  drink("Aviation", ["2 oz gin", "1/2 oz maraschino liqueur", "1/4 oz crème de violette", "3/4 oz lemon juice"]),
  drink("Gimlet", ["2 oz gin", "3/4 oz lime juice", "Note: Variations to shake with: cucumber, mint, basil"]),
  drink("Martini", ["2 1/4 oz gin", "1/2 oz dry vermouth", "Note: Dirty: 1/2 oz olive brine"]),
  drink("Cold Brew Old Fashioned", ["1 1/2 oz bourbon", "1/4 oz maple syrup", "Garnish: Smoked cinnamon stick"], "Whiskey/Rye/Bourbon"),
  drink("Tom Collins", ["2 oz gin", "1 oz lemon juice", "Club soda (to top)"]),
  drink("Ramos Gin Fizz", ["2 oz gin", "1/2 oz lemon juice", "Soda water (To top)"]),
  drink("Orange Julius", ["1 1/2 oz vodka", "1 oz Grand Marnier", "1 oz cream"], "Vodka"),
  drink("Tequila Sunrise", ["1 1/2 oz tequila", "4 oz orange juice"], "Tequila"),
  drink("Margarita", ["2 oz blanco tequila", "1 oz cointreau", "3/4 oz lime juice"], "Tequila"),
  drink("Piña Colada", ["2 oz white rum", "3 oz pineapple juice", "Steps: blend"], "Rum"),
];

const names = (text) => searchByText(records, text).map((record) => record.name);

describe("searchByText", () => {
  it("returns everything for an empty search", () => {
    expect(searchByText(records, "  ")).toHaveLength(records.length);
  });

  it("finds a drink by its name without pulling in near-miss ingredients", () => {
    expect(names("Orange Julius")).toEqual(["Orange Julius"]);
  });

  it("still allows a small typo", () => {
    expect(names("margerita")).toEqual(["Margarita"]);
  });

  it("adds synonym matches only when the whole search is a synonym name", () => {
    expect(names("Canton Breeze")).toEqual(["Canton Breeze"]);
    expect(names("canton")).toEqual(expect.arrayContaining(["Canton Breeze", "Ginger Gold Rush", "Prospector’s Smash"]));
    expect(names("club soda")).toEqual(expect.arrayContaining(["Tom Collins", "Ramos Gin Fizz"]));
  });

  it("finds whole words in notes, after the main results", () => {
    expect(names("olive")).toEqual(["Martini"]);
    expect(names("blend")).toEqual(["Piña Colada"]);
    expect(names("mint")).toEqual(["Gimlet"]);
  });

  it("does not match notes on a near-miss", () => {
    expect(names("Aviation")).toEqual(["Aviation"]);
  });

  it("matches notes only when every word is there", () => {
    expect(names("olive brine")).toEqual(["Martini"]);
    expect(names("olive cucumber")).toEqual([]);
  });
});

describe("searching the way phones type", () => {
  it("ignores capitals, a trailing space and curly apostrophes", () => {
    expect(searchByText(records, "AVIATION ").map((r) => r.name)).toEqual(["Aviation"]);
    expect(searchByText(records, "Prospector’s").map((r) => r.name)).toEqual(["Prospector’s Smash"]);
    expect(searchByText(records, "prospector's").map((r) => r.name)).toEqual(["Prospector’s Smash"]);
  });
});

describe("searching by category for brand names", () => {
  const bar = [
    drink("Toronto", ["2 oz rye", "1/4 oz simple syrup", "1/4 oz Fernet Branca", "2 dashes angostura bitters"], "Whiskey/Rye/Bourbon"),
    drink("Paper Plane", ["3/4 oz bourbon", "3/4 oz aperol", "1 ounce of Amari", "3/4 oz lemon juice"], "Whiskey/Rye/Bourbon"),
    drink("Negroni", ["1 oz gin", "1 oz Campari", "1 oz sweet vermouth"]),
    drink("Bloody Mary", ["2 oz vodka", "4 oz tomato juice", "2 dashes Tabasco sauce"], "Vodka"),
  ];

  it("'amaro' finds Fernet Branca and amari drinks, not Campari ones", () => {
    const names = searchByText(bar, "amaro").map((r) => r.name);
    expect(names).toEqual(expect.arrayContaining(["Toronto", "Paper Plane"]));
    expect(names).not.toContain("Negroni");
  });

  it("'hot sauce' finds Tabasco", () => {
    expect(searchByText(bar, "hot sauce").map((r) => r.name)).toContain("Bloody Mary");
  });
});

describe("searching with brand names in recipes", () => {
  const shelf = [
    drink("Tito's Mule", ["2 oz Tito's", "4 oz ginger beer", "1/2 oz lime juice"], "Vodka"),
    drink("Moscow Mule", ["2 oz vodka", "4 oz ginger beer", "1/2 oz lime juice"], "Vodka"),
    drink("Gin and Tonic", ["2 oz gin", "4 oz tonic"]),
    drink("Kentucky Buck", ["2 oz Maker's Mark", "1 oz lemon juice", "ginger beer"], "Whiskey/Rye/Bourbon"),
  ];
  const names = (q) => searchByText(shelf, q).map((r) => r.name);

  it("a category finds drinks that only name a brand", () => {
    expect(names("vodka")).toEqual(expect.arrayContaining(["Moscow Mule", "Tito's Mule"]));
    expect(names("whiskey")).toContain("Kentucky Buck");
  });

  it("a brand's own name only finds drinks with that brand", () => {
    expect(names("tito's")).toEqual(["Tito's Mule"]);
  });
});
