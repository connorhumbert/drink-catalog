import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BarTab, { ADD_PAUSE_MS, ADDED_MESSAGE_MS } from "./BarTab";

const DRINKS = [
  { _id: "gold-rush", name: "Gold Rush", booze: "Whiskey/Rye/Bourbon", ingredients: ["2 oz bourbon", "3/4 oz honey syrup", "3/4 oz lemon juice"] },
  { _id: "old-fashioned", name: "Old Fashioned", booze: "Whiskey/Rye/Bourbon", ingredients: ["2 oz bourbon", "1/4 oz simple syrup", "2 dashes angostura bitters"] },
];

jest.mock("../../database/useDrinks", () => ({
  __esModule: true,
  default: () => ({ records: DRINKS, loading: false, error: null, fromCache: false }),
}));

function renderBar(items) {
  localStorage.setItem("myBar", JSON.stringify({ items, basics: true }));
  render(
    <MemoryRouter>
      <BarTab />
    </MemoryRouter>
  );
}

const section = (title) => screen.getByRole("heading", { name: new RegExp(title) }).closest("section");
const savedItems = () => JSON.parse(localStorage.getItem("myBar")).items;

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.useRealTimers();
  localStorage.clear();
});

describe("My Bar: ＋ I have …", () => {
  it("adds the missing ingredient, moves the drink up and says so", () => {
    renderBar(["bourbon", "lemon juice"]);
    expect(within(section("Ready to make")).queryByText("Gold Rush")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "＋ I have honey syrup" }));

    expect(savedItems()).toEqual(["bourbon", "lemon juice", "honey syrup"]);
    expect(within(section("Ready to make")).getByText("Gold Rush")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toMatch(/Added honey syrup to your bar/);
  });

  it("Undo takes it back out", () => {
    renderBar(["bourbon", "lemon juice"]);
    fireEvent.click(screen.getByRole("button", { name: "＋ I have honey syrup" }));
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));

    expect(savedItems()).toEqual(["bourbon", "lemon juice"]);
    expect(within(section("Need one more thing")).getByText("Gold Rush")).toBeTruthy();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("the message goes away by itself", () => {
    renderBar(["bourbon", "lemon juice"]);
    fireEvent.click(screen.getByRole("button", { name: "＋ I have angostura bitters" }));
    act(() => jest.advanceTimersByTime(ADDED_MESSAGE_MS));
    expect(screen.queryByRole("status")).toBeNull();
    expect(savedItems()).toContain("angostura bitters");
  });

  it("ignores a quick second tap, so the next card's button can't be hit by accident", () => {
    renderBar(["bourbon", "lemon juice"]);
    fireEvent.click(screen.getByRole("button", { name: "＋ I have honey syrup" }));
    fireEvent.click(screen.getByRole("button", { name: "＋ I have angostura bitters" }));
    expect(savedItems()).toEqual(["bourbon", "lemon juice", "honey syrup"]);

    act(() => jest.advanceTimersByTime(ADD_PAUSE_MS));
    fireEvent.click(screen.getByRole("button", { name: "＋ I have angostura bitters" }));
    expect(savedItems()).toEqual(["bourbon", "lemon juice", "honey syrup", "angostura bitters"]);
  });

  it("only shows on drinks that are one away", () => {
    renderBar(["bourbon", "lemon juice", "honey syrup"]);
    expect(within(section("Ready to make")).queryByRole("button", { name: /I have/ })).toBeNull();
    expect(within(section("Need one more thing")).getByRole("button", { name: "＋ I have angostura bitters" })).toBeTruthy();
  });
});
