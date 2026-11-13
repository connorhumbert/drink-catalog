import React from "react";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import UpdateBanner, { RELOAD_DELAY_MS, isFormPage } from "./UpdateBanner";
import { onNewVersion } from "../serviceWorkerRegistration";

jest.mock("../serviceWorkerRegistration", () => ({ onNewVersion: jest.fn() }));

let announce;
let goTo;

function GoTo() {
  goTo = useNavigate();
  return null;
}

function renderAt(path, reload) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <UpdateBanner reload={reload} />
      <Routes>
        <Route path="*" element={<GoTo />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.useFakeTimers();
  onNewVersion.mockImplementation((callback) => {
    announce = callback;
    return () => {};
  });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("isFormPage", () => {
  it("is true only on Add and Edit", () => {
    expect(isFormPage("/create")).toBe(true);
    expect(isFormPage("/edit/abc123")).toBe(true);
    expect(isFormPage("/")).toBe(false);
    expect(isFormPage("/bar")).toBe(false);
    expect(isFormPage("/bar/bottles")).toBe(false);
  });
});

describe("UpdateBanner", () => {
  it("shows nothing until there's a new version", () => {
    const reload = jest.fn();
    renderAt("/", reload);
    expect(screen.queryByRole("status")).toBeNull();
    act(() => jest.advanceTimersByTime(RELOAD_DELAY_MS * 2));
    expect(reload).not.toHaveBeenCalled();
  });

  it("says it's updating, then reloads", () => {
    const reload = jest.fn();
    renderAt("/bar", reload);
    act(() => announce());
    expect(screen.getByRole("status").textContent).toMatch(/Updating to the newest version/);
    expect(reload).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(RELOAD_DELAY_MS));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("waits on Add and Edit until the person leaves the form", () => {
    const reload = jest.fn();
    renderAt("/edit/abc123", reload);
    act(() => announce());
    act(() => jest.advanceTimersByTime(RELOAD_DELAY_MS * 5));
    expect(screen.queryByRole("status")).toBeNull();
    expect(reload).not.toHaveBeenCalled();

    act(() => goTo("/"));
    expect(screen.getByRole("status")).toBeTruthy();
    act(() => jest.advanceTimersByTime(RELOAD_DELAY_MS));
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
