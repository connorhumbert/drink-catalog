import React from "react";
import { act, render, screen } from "@testing-library/react";
import useDrinks, { DrinksProvider, RETRY_DELAYS_MS } from "./useDrinks";
import { reconnect, subscribeDrinks } from "./drinksApi";

jest.mock("./drinksApi", () => ({ reconnect: jest.fn(), subscribeDrinks: jest.fn() }));

// The callbacks of the most recent subscribeDrinks call: `update(records)` and `fail(error)`.
let live;
const unsubscribe = jest.fn();

function Count() {
  const { records, loading } = useDrinks();
  return <p>{loading ? "loading" : `${records.length} drinks`}</p>;
}

function renderProvider() {
  return render(
    <DrinksProvider>
      <Count />
    </DrinksProvider>
  );
}

function comeBackToApp() {
  document.dispatchEvent(new Event("visibilitychange"));
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(console, "error").mockImplementation(() => {});
  subscribeDrinks.mockImplementation((onChange, onError) => {
    live = { update: (records) => onChange(records, false), fail: (error) => onError(error) };
    return unsubscribe;
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
  console.error.mockRestore();
});

describe("DrinksProvider", () => {
  it("shows the live list", () => {
    renderProvider();
    act(() => live.update([{ _id: "a" }, { _id: "b" }]));
    expect(screen.getByText("2 drinks")).toBeTruthy();
  });

  it("starts the list again after an error, and keeps the drinks shown meanwhile", () => {
    renderProvider();
    act(() => live.update([{ _id: "a" }]));
    act(() => live.fail(new Error("Connection to Indexed Database server lost")));
    expect(screen.getByText("1 drinks")).toBeTruthy();
    expect(subscribeDrinks).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(RETRY_DELAYS_MS[0]));
    expect(subscribeDrinks).toHaveBeenCalledTimes(2);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    act(() => live.update([{ _id: "a" }, { _id: "b" }]));
    expect(screen.getByText("2 drinks")).toBeTruthy();
  });

  it("waits longer between restarts if it keeps failing", () => {
    renderProvider();
    act(() => live.fail(new Error("first")));
    act(() => jest.advanceTimersByTime(RETRY_DELAYS_MS[0]));
    act(() => live.fail(new Error("second")));
    act(() => jest.advanceTimersByTime(RETRY_DELAYS_MS[0]));
    expect(subscribeDrinks).toHaveBeenCalledTimes(2);
    act(() => jest.advanceTimersByTime(RETRY_DELAYS_MS[1] - RETRY_DELAYS_MS[0]));
    expect(subscribeDrinks).toHaveBeenCalledTimes(3);
  });

  it("on coming back to the app, catches up if the list is running", () => {
    renderProvider();
    act(() => live.update([{ _id: "a" }]));
    act(() => comeBackToApp());
    expect(reconnect).toHaveBeenCalledTimes(1);
    expect(subscribeDrinks).toHaveBeenCalledTimes(1);
  });

  it("on coming back to the app, starts the list again straight away if it had stopped", () => {
    renderProvider();
    act(() => live.fail(new Error("stopped")));
    act(() => comeBackToApp());
    expect(subscribeDrinks).toHaveBeenCalledTimes(2);
    expect(reconnect).not.toHaveBeenCalled();
  });
});
