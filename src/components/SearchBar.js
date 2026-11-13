import React, { useMemo, useRef } from "react";
import { BOOZE_TYPES } from "../boozeTypes";
import { normalize } from "../ingredients";
import "./SearchBar.css";

const BOOZE_OPTIONS = [{ label: "All", value: "None" }, ...BOOZE_TYPES];
const MAX_INGREDIENT_SUGGESTIONS = 4;

// One search box. Typing filters by drink name or ingredient as you go; matching ingredients are also offered as
// "Show drinks made with…" buttons, which become removable filters ("Made with: mint ✕").
export default function SearchBar({ query, setQuery, booze, setBooze, tags, setTags, suggestions, count, onClear }) {
  const inputRef = useRef(null);
  const hasFilters = query !== "" || booze !== "None" || tags.length > 0;

  // Every word used in an ingredient name ("mint" from "mint leaves"), so a typed whole word can be offered on its own.
  const ingredientWords = useMemo(
    () => new Set(suggestions.flatMap((name) => normalize(name).split(/[^a-z0-9]+/)).filter((word) => word.length > 2)),
    [suggestions]
  );

  const ingredientMatches = useMemo(() => {
    const text = normalize(query.trim());
    if (text.length < 2) return [];
    const matches = suggestions.filter(
      (name) => !tags.includes(name) && normalize(name).split(/[^a-z0-9]+/).some((word) => word.startsWith(text))
    );
    // "mint" matches every drink with mint in it, so offer it before "mint leaves", "mint sprig"...
    if (ingredientWords.has(text) && !tags.includes(text) && !matches.includes(text)) matches.unshift(text);
    return matches.slice(0, MAX_INGREDIENT_SUGGESTIONS);
  }, [query, suggestions, tags, ingredientWords]);

  const addIngredient = (name) => {
    setTags([...tags, name]);
    setQuery("");
    // Close the phone keyboard so the results are visible.
    inputRef.current?.blur();
  };

  return (
    <div className="search-bar">
      <div className="search-sticky">
        <div className="search-field">
          <input
            ref={inputRef}
            type="search"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputRef.current?.blur();
            }}
            placeholder="Search by drink or ingredient"
            aria-label="Search by drink or ingredient"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {query !== "" && (
            <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
      </div>

      {ingredientMatches.length > 0 && (
        <div className="ingredient-offer">
          <div className="filter-label">Show drinks made with:</div>
          <div className="chip-row">
            {ingredientMatches.map((name) => (
              <button type="button" key={name} className="chip offer-chip" onClick={() => addIngredient(name)}>
                + {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="made-with">
          <div className="filter-label">Made with:</div>
          <div className="chip-row">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                className="chip active"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                aria-label={`Remove ${tag}`}
              >
                {tag} <span aria-hidden="true">✕</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chip-row spirit-row" role="group" aria-label="Spirit">
        {BOOZE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`chip${booze === option.value ? " active" : ""}`}
            aria-pressed={booze === option.value}
            onClick={() => setBooze(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="result-row">
        <span>{count} {count === 1 ? "cocktail" : "cocktails"}</span>
        {hasFilters && (
          <button type="button" className="clear-link" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
