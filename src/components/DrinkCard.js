import React from "react";
import { Link } from "react-router-dom";
import { ingredientName, isGarnish, isNote, isNoteLine, noteLineText } from "../recipes/ingredients";
import "./DrinkCard.css";

const BOOZE_LABELS = { "Whiskey/Rye/Bourbon": "Whiskey", "Brandy/Cognac": "Brandy" };

// `missing` (optional) lists ingredients the user's bar lacks, shown in My Bar.
export default function DrinkCard({ record, open, missing, onToggle, onDelete }) {
  const ingredients = record.ingredients || [];
  const preview = ingredients.filter((item) => !isGarnish(item) && !isNote(item)).map(ingredientName).join(" · ");
  const notes = ingredients.filter(isNoteLine).map(noteLineText).filter(Boolean).map((note) => note.charAt(0).toUpperCase() + note.slice(1));

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
            <Link className="card-action" to={`/edit/${record._id}`}>Edit</Link>
            <button type="button" className="card-action danger" onClick={onDelete}>Delete</button>
          </div>
        </div>
      )}
    </article>
  );
}
