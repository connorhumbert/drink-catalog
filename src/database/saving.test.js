import {
  ConflictError,
  DeletedError,
  TimeoutError,
  deleteErrorMessage,
  sameRecipe,
  saveErrorMessage,
  toDrinkData,
  withTimeout,
} from "./saving";

const martini = { name: "Martini", booze: "Gin", ingredients: ["2 oz gin", "1/2 oz dry vermouth"], glass: "Martini", likes: 3 };

describe("sameRecipe", () => {
  it("ignores likes and timestamps", () => {
    expect(sameRecipe(martini, { ...martini, likes: 9, createdAt: "later" })).toBe(true);
  });

  it("notices a change to the name, ingredients or glass", () => {
    expect(sameRecipe(martini, { ...martini, name: "Dry Martini" })).toBe(false);
    expect(sameRecipe(martini, { ...martini, ingredients: ["2 oz gin", "1 oz dry vermouth"] })).toBe(false);
    expect(sameRecipe(martini, { ...martini, glass: "Coupe" })).toBe(false);
  });

  it("treats a missing glass the same as an empty one", () => {
    const { glass, ...noGlass } = martini;
    expect(sameRecipe({ ...noGlass }, { ...noGlass, glass: "" })).toBe(true);
  });
});

describe("saveErrorMessage", () => {
  it("explains a missing connection", () => {
    expect(saveErrorMessage({ code: "unavailable", message: "Failed to get document because the client is offline." })).toMatch(/no internet connection/);
    expect(saveErrorMessage(new TimeoutError())).toMatch(/no internet connection/);
  });

  it("explains a conflict and a deleted drink", () => {
    expect(saveErrorMessage(new ConflictError())).toMatch(/Someone else changed this cocktail/);
    expect(saveErrorMessage(new DeletedError())).toMatch(/deleted by someone else/);
  });

  it("has a fallback", () => {
    expect(saveErrorMessage(new Error("boom"))).toBe("Couldn't save. Please try again.");
  });
});

describe("deleteErrorMessage", () => {
  it("explains a missing connection, with a fallback", () => {
    expect(deleteErrorMessage(new TimeoutError())).toMatch(/no internet connection/);
    expect(deleteErrorMessage(new Error("boom"))).toBe("Couldn't delete the cocktail. Please try again.");
  });
});

describe("withTimeout", () => {
  it("passes a result through", async () => {
    await expect(withTimeout(Promise.resolve("ok"), 50)).resolves.toBe("ok");
  });

  it("rejects when the promise takes too long", async () => {
    await expect(withTimeout(new Promise(() => {}), 10)).rejects.toBeInstanceOf(TimeoutError);
  });
});

describe("toDrinkData", () => {
  const goldRush = { name: "Gold Rush", booze: "Whiskey/Rye/Bourbon", ingredients: [" 2 oz bourbon ", "", "  ", "3/4 oz honey syrup"] };

  it("trims lines, drops blank ones and adds a lowercase name for sorting", () => {
    expect(toDrinkData(goldRush)).toEqual({
      name: "Gold Rush",
      nameLower: "gold rush",
      booze: "Whiskey/Rye/Bourbon",
      ingredients: ["2 oz bourbon", "3/4 oz honey syrup"],
    });
  });

  it("leaves glass out when not given, but keeps an empty one so editing can clear it", () => {
    expect("glass" in toDrinkData(goldRush)).toBe(false);
    expect(toDrinkData({ ...goldRush, glass: "" }).glass).toBe("");
    expect(toDrinkData({ ...goldRush, glass: "Rocks" }).glass).toBe("Rocks");
  });

  it("only saves recipe fields, never likes, ids or dates", () => {
    const saved = toDrinkData({ ...goldRush, _id: "abc", likes: 5, createdAt: "yesterday" });
    expect(Object.keys(saved).sort()).toEqual(["booze", "ingredients", "name", "nameLower"]);
  });

  it("still accepts ingredients as one comma-separated string", () => {
    expect(toDrinkData({ ...goldRush, ingredients: "2 oz gin, 1 oz lemon juice" }).ingredients).toEqual(["2 oz gin", "1 oz lemon juice"]);
  });
});
