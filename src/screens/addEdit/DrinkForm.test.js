import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import DrinkForm from "./DrinkForm";

let onLine;

function setSignal(value) {
  onLine = value;
  window.dispatchEvent(new Event(value ? "online" : "offline"));
}

beforeEach(() => {
  onLine = true;
  jest.spyOn(navigator, "onLine", "get").mockImplementation(() => onLine);
});

afterEach(() => jest.restoreAllMocks());

function renderForm(onSubmit = jest.fn()) {
  render(<DrinkForm initial={{}} records={[]} submitLabel="Create Cocktail" onSubmit={onSubmit} />);
}

describe("DrinkForm and the connection", () => {
  it("disables saving while offline and keeps what was typed", () => {
    renderForm();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Gold Rush" } });
    expect(screen.getByRole("button", { name: "Create Cocktail" }).disabled).toBe(false);

    act(() => setSignal(false));
    const button = screen.getByRole("button", { name: "Connect to the internet to save" });
    expect(button.disabled).toBe(true);
    expect(screen.getByLabelText("Name").value).toBe("Gold Rush");

    act(() => setSignal(true));
    expect(screen.getByRole("button", { name: "Create Cocktail" }).disabled).toBe(false);
    expect(screen.getByLabelText("Name").value).toBe("Gold Rush");
  });

  it("shows why a save failed and keeps what was typed", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const onSubmit = jest.fn().mockRejectedValue({ code: "unavailable", message: "offline" });
    renderForm(onSubmit);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Gold Rush" } });
    fireEvent.click(screen.getByLabelText("Gin"));
    fireEvent.change(screen.getByLabelText("Ingredient 1"), { target: { value: "2 oz gin" } });
    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Create Cocktail" }).closest("form"));
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("alert").textContent).toMatch(/no internet connection/);
    expect(screen.getByLabelText("Name").value).toBe("Gold Rush");
    expect(screen.getByLabelText("Ingredient 1").value).toBe("2 oz gin");
  });

  it("turns off autocorrect for the garnish, but not for the name", () => {
    renderForm();
    expect(screen.getByLabelText("Name").getAttribute("autocorrect")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Garnish \(optional\)/ }));
    expect(screen.getByLabelText("Garnish").getAttribute("autocorrect")).toBe("off");
  });
});
