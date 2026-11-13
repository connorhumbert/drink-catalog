import { shareDrink } from "./shareDrink";

const gimlet = { _id: "g1", name: "Gimlet", ingredients: ["2 oz gin", "3/4 oz lime juice"] };
const text = "Gimlet\n• 2 oz gin\n• 3/4 oz lime juice";
const url = `${window.location.origin}/drink/g1`;

describe("shareDrink", () => {
  it("opens the phone's share sheet with the recipe and link", async () => {
    const share = jest.fn().mockResolvedValue();
    await expect(shareDrink(gimlet, { share })).resolves.toBe("shared");
    expect(share).toHaveBeenCalledWith({ title: "Gimlet", text, url });
  });

  it("does nothing more when the person closes the share sheet", async () => {
    const share = jest.fn().mockRejectedValue(Object.assign(new Error("cancelled"), { name: "AbortError" }));
    const writeText = jest.fn();
    await expect(shareDrink(gimlet, { share, clipboard: { writeText } })).resolves.toBe("cancelled");
    expect(writeText).not.toHaveBeenCalled();
  });

  it("copies the recipe and link where there's no share sheet", async () => {
    const writeText = jest.fn().mockResolvedValue();
    await expect(shareDrink(gimlet, { clipboard: { writeText } })).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith(`${text}\n\n${url}`);
  });

  it("falls back to copying if the share sheet refuses", async () => {
    const share = jest.fn().mockRejectedValue(Object.assign(new Error("no"), { name: "NotAllowedError" }));
    const writeText = jest.fn().mockResolvedValue();
    await expect(shareDrink(gimlet, { share, clipboard: { writeText } })).resolves.toBe("copied");
  });

  it("says when neither is possible", async () => {
    await expect(shareDrink(gimlet, {})).resolves.toBe("unavailable");
    const writeText = jest.fn().mockRejectedValue(new Error("denied"));
    await expect(shareDrink(gimlet, { clipboard: { writeText } })).resolves.toBe("unavailable");
  });
});
