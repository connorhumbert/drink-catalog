import React, { useMemo, useState } from "react";
import { BOOZE_TYPES } from "../../recipes/boozeTypes";
import { buildSuggestions, fromFormState, normalize, toFormState } from "../../recipes/ingredients";
import { saveErrorMessage } from "../../database/saving";
import { GLASSES, suggestGarnishes, suggestGlass } from "../../recipes/suggestions";
import useOnline from "../../hooks/useOnline";
import IngredientEditor, { newRow } from "./IngredientEditor";
import "./edit&create.css";

// Shared by Create and Edit. `initial` is only read on first render, so mount it once the data is loaded.
// `onSubmit` must save to the server and throw if it couldn't; the error is shown above the button and the form keeps
// what was typed.
export default function DrinkForm({ initial, records, excludeId, submitLabel, onSubmit }) {
  const [name, setName] = useState(initial.name || "");
  const [booze, setBooze] = useState(initial.booze || "");
  const [glass, setGlass] = useState(initial.glass || "");
  const [{ startRows, startGarnish, startNotes }] = useState(() => {
    const state = toFormState(initial.ingredients || []);
    return { startRows: state.rows, startGarnish: state.garnish, startNotes: state.notes };
  });
  const [rows, setRows] = useState(() => (startRows.length ? startRows.map((text) => ({ text })) : [{}, {}, {}]).map(newRow));
  const [garnish, setGarnish] = useState(startGarnish);
  const [notes, setNotes] = useState(startNotes);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const online = useOnline();

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
    if (saving || !online) return;
    setSaving(true);
    setSaveError("");
    try {
      await onSubmit({ name: name.trim(), booze, glass, ingredients: fromFormState(rows.map((row) => row.text), garnish, notes) });
    } catch (error) {
      console.error("Error saving cocktail:", error);
      setSaveError(saveErrorMessage(error));
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
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          className="form-control notes-input"
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={"e.g. Shake with ice and strain\nFor a dirty martini, add 1/2 oz olive brine"}
        />
        <p className="field-hint">Steps, variations or tips. One per line.</p>
      </div>

      <OptionalSection id="glass" title="Glass" value={glass}>
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
      </OptionalSection>

      <OptionalSection id="garnish" title="Garnish" value={garnish.trim()}>
        <input
          type="text"
          className="form-control"
          id="garnish"
          aria-label="Garnish"
          autoCorrect="off"
          spellCheck={false}
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
      </OptionalSection>

      <div className="form-group">
        {saveError && (
          <p className="field-hint warn save-error" role="alert">
            {saveError}
          </p>
        )}
        <button type="submit" className="btn-accent" disabled={saving || !online}>
          {saving ? "Saving…" : online ? submitLabel : "Connect to the internet to save"}
        </button>
      </div>
    </form>
  );
}

// An optional part of the form that starts closed, so people who don't care about it can skip it.
// The closed header still shows what's chosen ("Glass · Coupe"), so nothing is hidden when editing a drink.
function OptionalSection({ id, title, value, children }) {
  const [open, setOpen] = useState(false);
  const panelId = `${id}-section`;
  return (
    <div className={`form-group optional-section${open ? " open" : ""}`}>
      <button
        type="button"
        className="optional-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        <span className="optional-title">{title} (optional)</span>
        <span className="optional-value">{value || (open ? "" : "Tap to add")}</span>
        <span className="chevron" aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="optional-body" id={panelId}>
          {children}
        </div>
      )}
    </div>
  );
}
