import React from "react";
import { Link } from "react-router-dom";
import { ingredientName, isGarnish } from "../ingredients";
import "./DrinkCard.css";

const BOOZE_LABELS = { "Whiskey/Rye/Bourbon": "Whiskey" };

export default function DrinkCard({ record, open, onToggle, onDelete }) {
  const ingredients = record.ingredients || [];
  const preview = ingredients.filter((item) => !isGarnish(item)).map(ingredientName).join(" · ");

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
        {!open && <span className="drink-preview">{preview}</span>}
        {!open && <span className="tap-hint">Tap for full recipe</span>}
      </button>
      {open && (
        <div className="drink-body">
          <ul className="drink-ingredients">
            {ingredients.map((item, index) => (
              <li key={index} className={isGarnish(item) ? "garnish" : undefined}>{item}</li>
            ))}
          </ul>
          <div className="drink-actions">
            <Link className="card-action" to={`/edit/${record._id}`}>Edit</Link>
            <button type="button" className="card-action danger" onClick={onDelete}>Delete</button>
          </div>
        </div>
      )}
    </article>
  );
}
