import React, { useMemo, useState } from "react";
import { BOOZE_TYPES } from "../boozeTypes";
import { buildSuggestions, fromFormState, normalize, toFormState } from "../ingredients";
import { GLASSES, suggestGarnishes, suggestGlass } from "../suggestions";
import IngredientEditor, { newRow } from "./IngredientEditor";
import "./edit&create.css";

// Shared by Create and Edit. `initial` is only read on first render, so mount it once the data is loaded.
export default function DrinkForm({ initial, records, excludeId, submitLabel, onSubmit }) {
  const [name, setName] = useState(initial.name || "");
  const [booze, setBooze] = useState(initial.booze || "");
  const [glass, setGlass] = useState(initial.glass || "");
  const [{ startRows, startGarnish }] = useState(() => {
    const state = toFormState(initial.ingredients || []);
    return { startRows: state.rows, startGarnish: state.garnish };
  });
  const [rows, setRows] = useState(() => (startRows.length ? startRows.map((text) => ({ text })) : [{}, {}, {}]).map(newRow));
  const [garnish, setGarnish] = useState(startGarnish);
  const [saving, setSaving] = useState(false);

  const ingredientSuggestions = useMemo(() => buildSuggestions(records), [records]);
  const ingredientLines = rows.map((row) => row.text.trim()).filter(Boolean);
  const suggestedGlass = suggestGlass(ingredientLines, booze);
  const garnishChips = useMemo(
    () => suggestGarnishes(ingredientLines, records),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ingredientLines.join("|"), records]
  );

  const duplicate = useMemo(() => {
    const wanted = normalize(name).trim();
    return wanted && records.some((r) => r._id !== excludeId && normalize(r.name).trim() === wanted);
  }, [name, records, excludeId]);

  function addGarnish(option) {
    const current = garnish.split(",").map((part) => part.trim()).filter(Boolean);
    if (current.some((part) => part.toLowerCase() === option.toLowerCase())) return;
    setGarnish([...current, option].join(", "));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), booze, glass, ingredients: fromFormState(rows.map((row) => row.text), garnish) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {duplicate && <p className="field-hint warn">A cocktail called “{name.trim()}” already exists. Check the list first so there isn't a duplicate.</p>}
      </div>

      <div className="form-group">
        <label>Booze Type</label>
        <div className="pill-group">
          {BOOZE_TYPES.map((option, index) => (
            <div className="pill" key={option.value}>
              <input
                type="radio"
                name="boozeOptions"
                id={`booze${option.value}`}
                value={option.value}
                checked={booze === option.value}
                onChange={(e) => setBooze(e.target.value)}
                required={index === 0}
              />
              <label htmlFor={`booze${option.value}`}>{option.full || option.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Ingredients (one per line, like “2 oz bourbon”)</label>
        <IngredientEditor rows={rows} setRows={setRows} suggestions={ingredientSuggestions} />
      </div>

      <div className="form-group">
        <label>Glass (optional)</label>
        <div className="chip-row">
          {GLASSES.map((option) => (
            <button
              type="button"
              key={option}
              className={`chip${glass === option ? " active" : ""}`}
              aria-pressed={glass === option}
              onClick={() => setGlass(glass === option ? "" : option)}
            >
              {option}
              {suggestedGlass === option && glass !== option && <span className="chip-tag">suggested</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="garnish">Garnish (optional)</label>
        <input
          type="text"
          className="form-control"
          id="garnish"
          value={garnish}
          onChange={(e) => setGarnish(e.target.value)}
          placeholder="e.g. Orange twist"
        />
        {garnishChips.length > 0 && (
          <div className="chip-row">
            {garnishChips.map((option) => (
              <button type="button" key={option} className="chip" onClick={() => addGarnish(option)}>
                + {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <button type="submit" className="btn-accent" disabled={saving}>{submitLabel}</button>
      </div>
    </form>
  );
}
