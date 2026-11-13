import React, { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import IngredientEditor, { HIDE_DELAY_MS, newRow } from "./IngredientEditor";

const SUGGESTIONS = ["lemon juice", "fresh lemon juice", "lemon wedge", "bourbon"];

let currentRows;

function Editor({ initial }) {
  const [rows, setRows] = useState(() => initial.map((text) => newRow({ text })));
  currentRows = rows;
  return <IngredientEditor rows={rows} setRows={setRows} suggestions={SUGGESTIONS} />;
}

function typeInto(input, text) {
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: text } });
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("IngredientEditor suggestions", () => {
  it("suggests ingredients matching what's typed after the amount", () => {
    render(<Editor initial={[""]} />);
    typeInto(screen.getByLabelText("Ingredient 1"), "3/4 lemon");
    expect(screen.getByRole("button", { name: "lemon juice" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "fresh lemon juice" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "lemon wedge" })).toBeTruthy();
  });

  it("fills in a tapped suggestion even when the box loses focus first, as on an iPhone", () => {
    render(<Editor initial={[""]} />);
    const input = screen.getByLabelText("Ingredient 1");
    typeInto(input, "3/4 lemon");
    const chip = screen.getByRole("button", { name: "lemon juice" });

    fireEvent.blur(input);
    fireEvent.click(chip);

    expect(currentRows[0].text).toBe("3/4 lemon juice");
  });

  it("keeps the amount and unit", () => {
    render(<Editor initial={[""]} />);
    const input = screen.getByLabelText("Ingredient 1");
    typeInto(input, "1 1/2 oz bour");
    fireEvent.click(screen.getByRole("button", { name: "bourbon" }));
    expect(currentRows[0].text).toBe("1 1/2 oz bourbon");
  });

  it("hides the suggestions shortly after leaving the box", () => {
    render(<Editor initial={[""]} />);
    const input = screen.getByLabelText("Ingredient 1");
    typeInto(input, "3/4 lemon");
    fireEvent.blur(input);
    expect(screen.queryByRole("button", { name: "lemon juice" })).toBeTruthy();
    act(() => jest.advanceTimersByTime(HIDE_DELAY_MS));
    expect(screen.queryByRole("button", { name: "lemon juice" })).toBeNull();
  });

  it("keeps showing suggestions when focus comes straight back", () => {
    render(<Editor initial={[""]} />);
    const input = screen.getByLabelText("Ingredient 1");
    typeInto(input, "3/4 lemon");
    fireEvent.blur(input);
    fireEvent.focus(input);
    act(() => jest.advanceTimersByTime(HIDE_DELAY_MS * 2));
    expect(screen.queryByRole("button", { name: "lemon juice" })).toBeTruthy();
  });
});

describe("IngredientEditor on a phone", () => {
  it("copes with an automatic capital and a trailing space", () => {
    render(<Editor initial={[""]} />);
    typeInto(screen.getByLabelText("Ingredient 1"), "3/4 Lemon ");
    expect(screen.getByRole("button", { name: "lemon juice" })).toBeTruthy();
  });

  it("splits a pasted recipe into one row per line, skipping blank lines", () => {
    render(<Editor initial={[""]} />);
    const input = screen.getByLabelText("Ingredient 1");
    fireEvent.paste(input, { clipboardData: { getData: () => "2 oz gin\n1 oz lemon juice\n\n3/4 oz simple syrup\n" } });
    expect(currentRows.map((row) => row.text)).toEqual(["2 oz gin", "1 oz lemon juice", "3/4 oz simple syrup"]);
  });

  it("adds pasted lines after a row that already has text", () => {
    render(<Editor initial={["2 oz bourbon"]} />);
    fireEvent.paste(screen.getByLabelText("Ingredient 1"), { clipboardData: { getData: () => "1 oz lemon juice\n3/4 oz honey syrup" } });
    expect(currentRows.map((row) => row.text)).toEqual(["2 oz bourbon", "1 oz lemon juice", "3/4 oz honey syrup"]);
  });

  it("turns off iPhone autocorrect", () => {
    render(<Editor initial={[""]} />);
    const input = screen.getByLabelText("Ingredient 1");
    expect(input.getAttribute("autocorrect")).toBe("off");
    expect(input.getAttribute("spellcheck")).toBe("false");
  });
});
