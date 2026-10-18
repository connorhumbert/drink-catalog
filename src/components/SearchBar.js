import React, { useMemo, useState } from "react";
import { normalize } from "../ingredients";
import "./SearchBar.css";

const BOOZE_OPTIONS = [
  { label: "All", value: "None" },
  { label: "Whiskey", value: "Whiskey/Rye/Bourbon" },
  { label: "Gin", value: "Gin" },
  { label: "Rum", value: "Rum" },
  { label: "Tequila", value: "Tequila" },
  { label: "Vodka", value: "Vodka" },
  { label: "Wine", value: "Wine" },
];

export default function SearchBar({ query, setQuery, booze, setBooze, tags, setTags, suggestions, count, onClear }) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const hasFilters = query !== "" || booze !== "None" || tags.length > 0;

  const matches = useMemo(() => {
    const text = normalize(draft.trim());
    if (!text) return [];
    return suggestions
      .filter((name) => !tags.includes(name) && normalize(name).split(/[^a-z0-9]+/).some((word) => word.startsWith(text)))
      .slice(0, 6);
  }, [draft, suggestions, tags]);

  const addTag = (value) => {
    const tag = value.trim().toLowerCase();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setDraft("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="search-bar">
      <div className="search-sticky">
        <input
          type="search"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search drinks or ingredients"
          aria-label="Search drinks"
        />
      </div>

      <div className="chip-row" role="group" aria-label="Booze type">
        {BOOZE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`chip${booze === option.value ? " active" : ""}`}
            onClick={() => setBooze(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="have-box">
        <div className="have-label">Ingredients I have (see what I can make)</div>
        <div className="tag-input">
          {tags.map((tag) => (
            <button key={tag} type="button" className="tag" onClick={() => setTags(tags.filter((t) => t !== tag))}>
              {tag} <span aria-hidden="true">×</span>
              <span className="sr-only"> remove</span>
            </button>
          ))}
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={tags.length ? "add another" : "lime, bourbon, honey…"}
            aria-label="Ingredients you have"
            enterKeyHint="done"
          />
        </div>
        {focused && draft.trim() !== "" && (
          <ul className="suggestions">
            {matches.map((name) => (
              <li key={name}>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => addTag(name)}>{name}</button>
              </li>
            ))}
            <li>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => addTag(draft)}>
                Add “{draft.trim()}”
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className="result-row">
        <span>{count} {count === 1 ? "cocktail" : "cocktails"}</span>
        {hasFilters && (
          <button
            type="button"
            className="clear-link"
            onClick={() => {
              setDraft("");
              onClear();
            }}
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
