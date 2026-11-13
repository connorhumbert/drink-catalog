import React, { useEffect, useRef, useState } from "react";
import { joinIngredient, normalize, splitIngredient } from "../../recipes/ingredients";

let nextRowId = 1;
export function newRow(row = {}) {
  return { id: nextRowId++, text: "", ...row };
}

const PLACEHOLDERS = ["2 oz bourbon", "3/4 oz lemon juice", "Soda water (to top)"];

// Ingredient names that start a word with what's typed after the amount/unit, e.g. "2 oz bou" -> "bourbon".
function matchesFor(text, suggestions) {
  const tail = normalize(splitIngredient(text).name.split("(")[0]).trim();
  if (tail.length < 2) return [];
  return suggestions
    .filter((name) => name !== tail && (name.startsWith(tail) || name.includes(` ${tail}`)))
    .slice(0, 5);
}

// How long suggestions stay after the box loses focus. Tapping a suggestion on an iPhone takes focus from the box
// before the tap itself arrives; if the suggestions vanished straight away, the tap would land on nothing.
export const HIDE_DELAY_MS = 250;

export default function IngredientEditor({ rows, setRows, suggestions }) {
  const [focusedId, setFocusedId] = useState(null);
  const hideTimer = useRef();
  useEffect(() => () => clearTimeout(hideTimer.current), []);

  function showSuggestionsFor(id) {
    clearTimeout(hideTimer.current);
    setFocusedId(id);
  }

  function hideSuggestionsSoon(id) {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setFocusedId((current) => (current === id ? null : current)), HIDE_DELAY_MS);
  }

  function updateRow(id, text) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, text } : row)));
  }

  function removeRow(id) {
    setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : [newRow()]));
  }

  function addRowAfter(id) {
    setRows((prev) => {
      const index = prev.findIndex((row) => row.id === id);
      const next = [...prev];
      next.splice(index + 1, 0, newRow({ autoFocus: true }));
      return next;
    });
  }

  // Pasting a whole recipe splits it into one row per line.
  function handlePaste(e, id) {
    const text = e.clipboardData.getData("text");
    if (!text.includes("\n")) return;
    e.preventDefault();
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
    setRows((prev) => {
      const index = prev.findIndex((row) => row.id === id);
      const replaceCurrent = !prev[index].text.trim();
      const added = lines.map((line) => newRow({ text: line }));
      const next = [...prev];
      next.splice(replaceCurrent ? index : index + 1, replaceCurrent ? 1 : 0, ...added);
      return next;
    });
  }

  function pick(row, name) {
    const { amount, unit } = splitIngredient(row.text);
    updateRow(row.id, joinIngredient({ amount, unit, name }));
  }

  return (
    <div className="ingredient-editor">
      {rows.map((row, index) => {
        const matches = focusedId === row.id ? matchesFor(row.text, suggestions) : [];
        return (
          <div className="ingredient-row" key={row.id}>
            <input
              className="form-control ing-text"
              aria-label={`Ingredient ${index + 1}`}
              placeholder={PLACEHOLDERS[Math.min(index, PLACEHOLDERS.length - 1)]}
              enterKeyHint="next"
              // Ingredient names aren't dictionary words: iPhone autocorrect would turn "orgeat" into "organ".
              autoCorrect="off"
              spellCheck={false}
              autoFocus={row.autoFocus}
              required={index === 0}
              value={row.text}
              onChange={(e) => updateRow(row.id, e.target.value)}
              onFocus={() => showSuggestionsFor(row.id)}
              onBlur={() => hideSuggestionsSoon(row.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addRowAfter(row.id);
                }
              }}
              onPaste={(e) => handlePaste(e, row.id)}
            />
            <button
              type="button"
              className="ing-remove"
              aria-label={`Remove ingredient ${index + 1}`}
              onClick={() => removeRow(row.id)}
            >
              ✕
            </button>
            {matches.length > 0 && (
              <div className="chip-row ing-suggest">
                {matches.map((name) => (
                  <button
                    type="button"
                    key={name}
                    className="chip"
                    // Keeps the keyboard open where the browser allows it (same as My Bar's suggestions).
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(row, name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        className="add-row"
        onClick={() => setRows((prev) => [...prev, newRow({ autoFocus: true })])}
      >
        + Add ingredient
      </button>
    </div>
  );
}
