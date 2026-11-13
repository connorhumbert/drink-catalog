import React, { useMemo, useState } from "react";
import { normalize } from "../../recipes/ingredients";
import "./TagInput.css";

// Removable chips plus a text box with autocomplete. Used for the list of things in My Bar.
export default function TagInput({ inputId, tags, setTags, suggestions, placeholder, emptyPlaceholder, ariaLabel }) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);

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
    <div className="tag-field">
      <div className="tag-input">
        {tags.map((tag) => (
          <button key={tag} type="button" className="tag" onClick={() => setTags(tags.filter((t) => t !== tag))}>
            {tag} <span aria-hidden="true">×</span>
            <span className="sr-only"> remove</span>
          </button>
        ))}
        <input
          id={inputId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={tags.length ? placeholder : emptyPlaceholder || placeholder}
          aria-label={ariaLabel}
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
  );
}
