import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DrinkPage from "./DrinkPage";
import useDrinks from "../../database/useDrinks";

jest.mock("../../database/useDrinks", () => ({ __esModule: true, default: jest.fn() }));

const gimlet = { _id: "g1", name: "Gimlet", booze: "Gin", ingredients: ["2 oz gin", "3/4 oz lime juice"], glass: "Coupe" };

function renderAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/drink/:id" element={<DrinkPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("DrinkPage", () => {
  it("shows the shared drink, already open", () => {
    useDrinks.mockReturnValue({ records: [gimlet], loading: false, error: null, fromCache: false });
    renderAt("/drink/g1");
    expect(screen.getByText("Gimlet")).toBeTruthy();
    expect(screen.getByText("3/4 oz lime juice")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Share" })).toBeTruthy();
  });

  it("says when the drink no longer exists, once the server has answered", () => {
    useDrinks.mockReturnValue({ records: [gimlet], loading: false, error: null, fromCache: false });
    renderAt("/drink/gone");
    expect(screen.getByText(/couldn't be found/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "See all cocktails" })).toBeTruthy();
  });

  it("waits for the server before saying a drink is missing", () => {
    useDrinks.mockReturnValue({ records: [gimlet], loading: false, error: null, fromCache: true });
    renderAt("/drink/new-one");
    expect(screen.queryByText(/couldn't be found/)).toBeNull();
    expect(document.querySelector(".custom-spinner")).toBeTruthy();
  });
});
