import { drinkShareText, drinkUrl } from "./shareText";

describe("drinkShareText", () => {
  it("writes the whole recipe as plain text", () => {
    const goldRush = {
      name: "Gold Rush",
      glass: "Rocks",
      ingredients: ["2 oz bourbon", "3/4 oz honey syrup", "Optional: 1 dash bitters", "Garnish: Lemon twist", "Note: shake with ice and strain"],
    };
    expect(drinkShareText(goldRush)).toBe(
      [
        "Gold Rush",
        "• 2 oz bourbon",
        "• 3/4 oz honey syrup",
        "• Optional: 1 dash bitters",
        "Garnish: Lemon twist",
        "Serve in: Rocks",
        "",
        "Notes:",
        "• Shake with ice and strain",
      ].join("\n")
    );
  });

  it("leaves out garnish, glass and notes when there are none", () => {
    expect(drinkShareText({ name: "Gimlet", ingredients: ["2 oz gin", "3/4 oz lime juice"] })).toBe("Gimlet\n• 2 oz gin\n• 3/4 oz lime juice");
  });

  it("copes with a drink that only has a name", () => {
    expect(drinkShareText({ name: "Mystery" })).toBe("Mystery");
  });

  it("reads older Steps lines as notes", () => {
    expect(drinkShareText({ name: "Daiquiri", ingredients: ["2 oz rum", "Steps: blend"] })).toBe("Daiquiri\n• 2 oz rum\n\nNotes:\n• Blend");
  });
});

describe("drinkUrl", () => {
  it("links to the drink's own page", () => {
    expect(drinkUrl("abc123", "https://drink-catalog.onrender.com")).toBe("https://drink-catalog.onrender.com/drink/abc123");
  });
});
