import React, { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import TagInput, { HIDE_DELAY_MS } from "./TagInput";

const SUGGESTIONS = ["bourbon", "peychaud's bitters", "lemon juice", "orgeat"];

let currentTags;

function Bar() {
  const [tags, setTags] = useState([]);
  currentTags = tags;
  return <TagInput inputId="bar-input" tags={tags} setTags={setTags} suggestions={SUGGESTIONS} placeholder="Type" ariaLabel="Add to bar" />;
}

function typeInto(input, text) {
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: text } });
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("My Bar's text box", () => {
  it("adds a tapped suggestion even when the box loses focus first, as on an iPhone", () => {
    render(<Bar />);
    const input = screen.getByLabelText("Add to bar");
    typeInto(input, "bour");
    const chip = screen.getByRole("button", { name: "bourbon" });
    fireEvent.blur(input);
    fireEvent.click(chip);
    expect(currentTags).toEqual(["bourbon"]);
  });

  it("hides the suggestions shortly after leaving the box", () => {
    render(<Bar />);
    const input = screen.getByLabelText("Add to bar");
    typeInto(input, "bour");
    fireEvent.blur(input);
    act(() => jest.advanceTimersByTime(HIDE_DELAY_MS));
    expect(screen.queryByRole("button", { name: "bourbon" })).toBeNull();
  });

  it("copes with how iPhones type: a capital letter, a trailing space, curly apostrophes", () => {
    render(<Bar />);
    const input = screen.getByLabelText("Add to bar");
    typeInto(input, "Bourbon ");
    expect(screen.getByRole("button", { name: "bourbon" })).toBeTruthy();
    typeInto(input, "Peychaud’s");
    expect(screen.getByRole("button", { name: "peychaud's bitters" })).toBeTruthy();
  });

  it("stores what was typed in lowercase without extra spaces", () => {
    render(<Bar />);
    const input = screen.getByLabelText("Add to bar");
    typeInto(input, "Fresh Limes ");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(currentTags).toEqual(["fresh limes"]);
  });

  it("turns off iPhone autocorrect and auto-capitals", () => {
    render(<Bar />);
    const input = screen.getByLabelText("Add to bar");
    expect(input.getAttribute("autocorrect")).toBe("off");
    expect(input.getAttribute("autocapitalize")).toBe("none");
    expect(input.getAttribute("spellcheck")).toBe("false");
  });
});

describe("My Bar's suggestions", () => {
  it("match across a space or an apostrophe", () => {
    render(<Bar />);
    const input = screen.getByLabelText("Add to bar");
    typeInto(input, "peychaud's");
    expect(screen.getByRole("button", { name: "peychaud's bitters" })).toBeTruthy();
    typeInto(input, "lemon j");
    expect(screen.getByRole("button", { name: "lemon juice" })).toBeTruthy();
    typeInto(input, "bitt");
    expect(screen.getByRole("button", { name: "peychaud's bitters" })).toBeTruthy();
  });
});
