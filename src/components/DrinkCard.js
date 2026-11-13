import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ingredientName, isGarnish, isNote, isNoteLine, noteLineText } from "../recipes/ingredients";
import { shareDrink } from "./shareDrink";
import "./DrinkCard.css";

// How long "Copied ✓" or "Couldn't share" stays on the Share button.
export const SHARE_MESSAGE_MS = 2500;
const SHARE_LABELS = { copied: "Copied ✓", unavailable: "Couldn't share" };

const BOOZE_LABELS = { "Whiskey/Rye/Bourbon": "Whiskey", "Brandy/Cognac": "Brandy" };

// `missing` (optional) lists ingredients the user's bar lacks, shown in My Bar. With `onHave`, each one gets an
// "I have …" button that adds it to the bar.
export default function DrinkCard({ record, open, missing, onToggle, onDelete, onHave }) {
  const ingredients = record.ingredients || [];
  const preview = ingredients.filter((item) => !isGarnish(item) && !isNote(item)).map(ingredientName).join(" · ");
  const notes = ingredients.filter(isNoteLine).map(noteLineText).filter(Boolean).map((note) => note.charAt(0).toUpperCase() + note.slice(1));

  // Phones open their share sheet, which is feedback enough. Computers copy the recipe instead, so say so briefly.
  const [shareResult, setShareResult] = useState(null);
  useEffect(() => {
    if (!shareResult) return undefined;
    const timer = setTimeout(() => setShareResult(null), SHARE_MESSAGE_MS);
    return () => clearTimeout(timer);
  }, [shareResult]);
  async function onShare() {
    const result = await shareDrink(record);
    if (SHARE_LABELS[result]) setShareResult(result);
  }

  return (
    <article className={`drink-card${open ? " open" : ""}`} data-booze={record.booze}>
      <button type="button" className="drink-card-head" onClick={onToggle} aria-expanded={open}>
        <span className="drink-card-top">
          <h2 className="drink-name">{record.name}</h2>
          <span className="card-meta">
            <span className="booze-badge">{BOOZE_LABELS[record.booze] || record.booze}</span>
            <span className="chevron" aria-hidden="true">▾</span>
          </span>
        </span>
        {missing && missing.length > 0 && <span className="drink-missing">You need: {missing.join(", ")}</span>}
        {!open && <span className="drink-preview">{preview}</span>}
        {!open && <span className="tap-hint">Tap for full recipe</span>}
      </button>
      {/* Outside the head button: a button can't sit inside another button. */}
      {onHave && missing && missing.length > 0 && (
        <div className="have-row">
          {missing.map((name) => (
            <button type="button" key={name} className="have-button" onClick={() => onHave(name)}>
              ＋ I have {name}
            </button>
          ))}
        </div>
      )}
      {open && (
        <div className="drink-body">
          <ul className="drink-ingredients">
            {ingredients.filter((item) => !isNoteLine(item)).map((item, index) => (
              <li key={index} className={isGarnish(item) ? "garnish" : undefined}>{item}</li>
            ))}
          </ul>
          {notes.length > 0 && (
            <div className="drink-notes">
              <h3>Notes</h3>
              <ul>
                {notes.map((note, index) => <li key={index}>{note}</li>)}
              </ul>
            </div>
          )}
          {record.glass && <p className="drink-glass">Serve in: {record.glass}</p>}
          <div className="drink-actions">
            <button type="button" className="card-action" onClick={onShare}>
              {SHARE_LABELS[shareResult] || "Share"}
            </button>
            <Link className="card-action" to={`/edit/${record._id}`}>Edit</Link>
            <button type="button" className="card-action danger" onClick={onDelete}>Delete</button>
          </div>
        </div>
      )}
    </article>
  );
}
