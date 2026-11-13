import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TabBar from "./TabBar";

function renderWithFields() {
  return render(
    <MemoryRouter>
      <input aria-label="Search" />
      <input type="checkbox" aria-label="Basics" />
      <TabBar />
    </MemoryRouter>
  );
}

const tabBar = () => screen.queryByRole("navigation", { name: "Main" });

describe("TabBar and the phone keyboard", () => {
  it("hides while typing, so it doesn't float above the keyboard, and comes back after", () => {
    renderWithFields();
    expect(tabBar()).toBeTruthy();
    fireEvent.focusIn(screen.getByLabelText("Search"));
    expect(tabBar()).toBeNull();
    fireEvent.focusOut(screen.getByLabelText("Search"), { relatedTarget: null });
    expect(tabBar()).toBeTruthy();
  });

  it("stays hidden when moving straight from one text box to another", () => {
    renderWithFields();
    const search = screen.getByLabelText("Search");
    fireEvent.focusIn(search);
    fireEvent.focusOut(search, { relatedTarget: document.createElement("textarea") });
    expect(tabBar()).toBeNull();
  });

  it("doesn't hide for a checkbox, which opens no keyboard", () => {
    renderWithFields();
    fireEvent.focusIn(screen.getByLabelText("Basics"));
    expect(tabBar()).toBeTruthy();
  });
});
