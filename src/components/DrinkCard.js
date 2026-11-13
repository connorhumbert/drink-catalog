import React from "react";
import { Link } from "react-router-dom";
import { ingredientName, isGarnish, isNote, isStep, stepText } from "../ingredients";
import "./DrinkCard.css";

const BOOZE_LABELS = { "Whiskey/Rye/Bourbon": "Whiskey", "Brandy/Cognac": "Brandy" };

// `missing` (optional) lists ingredients the user's bar lacks, shown in My Bar.
export default function DrinkCard({ record, open, liked, missing, onToggle, onDelete, onLike }) {
  const ingredients = record.ingredients || [];
  const preview = ingredients.filter((item) => !isGarnish(item) && !isNote(item)).map(ingredientName).join(" · ");
  const steps = ingredients.filter(isStep).map(stepText).filter(Boolean).map((step) => step.charAt(0).toUpperCase() + step.slice(1));

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
            {ingredients.filter((item) => !isStep(item)).map((item, index) => (
              <li key={index} className={isGarnish(item) ? "garnish" : undefined}>{item}</li>
            ))}
          </ul>
          {steps.length > 0 && (
            <div className="drink-steps">
              <h3>How to make it</h3>
              {steps.length === 1 ? (
                <p>{steps[0]}</p>
              ) : (
                <ol>
                  {steps.map((step, index) => <li key={index}>{step}</li>)}
                </ol>
              )}
            </div>
          )}
          {record.glass && <p className="drink-glass">Serve in: {record.glass}</p>}
          <div className="drink-actions">
            <button type="button" className={`card-action like${liked ? " liked" : ""}`} onClick={onLike} disabled={liked}>
              {liked ? "♥ Liked" : "♡ Like"}
              {record.likes > 0 && <span className="like-count">{record.likes}</span>}
            </button>
            <Link className="card-action" to={`/edit/${record._id}`}>Edit</Link>
            <button type="button" className="card-action danger" onClick={onDelete}>Delete</button>
          </div>
        </div>
      )}
    </article>
  );
}
