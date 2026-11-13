import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import useSessionState from "./useSessionState";

function Search() {
  const [query, setQuery] = useSessionState("test.query", "");
  return <input aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />;
}

afterEach(() => {
  jest.restoreAllMocks();
  sessionStorage.clear();
});

describe("useSessionState", () => {
  it("remembers the value for this tab", () => {
    const { unmount } = render(<Search />);
    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "gin" } });
    unmount();
    render(<Search />);
    expect(screen.getByLabelText("Search").value).toBe("gin");
  });

  it("still works when the browser won't store anything (private browsing, Lockdown Mode, full phone)", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    render(<Search />);
    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "gin" } });
    expect(screen.getByLabelText("Search").value).toBe("gin");
  });
});
