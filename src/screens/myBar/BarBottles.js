import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { buildSuggestions } from "../../recipes/ingredients";
import { BASICS_LABEL, isBasic, missingById, useCabinet } from "./cabinet";
import useDrinks from "../../database/useDrinks";
import TagInput from "./TagInput";
import "../addEdit/edit&create.css";
import "../drinks/SearchBar.css";
import "./MyBar.css";

const QUICK_ADD_COUNT = 24;

// Where you pick what's in your bar. Saved on this device only.
export default function BarBottles() {
  const { records } = useDrinks();
  const [bar, setBar] = useCabinet();

  const suggestions = useMemo(() => buildSuggestions(records, { minCount: 2 }), [records]);
  const setItems = (items) => setBar((prev) => ({ ...prev, items }));
  const addItem = (name) => {
    if (!bar.items.includes(name)) setItems([...bar.items, name]);
  };

  const readyCount = useMemo(() => {
    if (bar.items.length === 0) return 0;
    return [...missingById(records, bar).values()].filter((names) => names.length === 0).length;
  }, [records, bar]);

  const quickAdd = suggestions
    .filter((name) => !bar.items.includes(name) && !(bar.basics && isBasic(name)))
    .slice(0, QUICK_ADD_COUNT);

  function clearBar() {
    if (window.confirm("Remove everything from your bar?")) setItems([]);
  }

  return (
    <div className="form-page bar-bottles">
      <Link className="back-link" to="/bar">← My Bar</Link>
      <h2>What's in your bar?</h2>
      <p className="bar-intro">Type a bottle or mixer, or tap one from the list below. This is saved on this phone only.</p>

      <div className="form-group">
        <label htmlFor="bar-input">In my bar</label>
        <TagInput
          inputId="bar-input"
          tags={bar.items}
          setTags={setItems}
          suggestions={suggestions}
          placeholder="Type to add another"
          emptyPlaceholder="For example: bourbon, limes"
          ariaLabel="Add something to your bar"
        />
        {bar.items.length > 0 && <p className="field-help">Tap an item to remove it.</p>}
        <div className="basics-toggle">
          <input
            type="checkbox"
            id="bar-basics"
            checked={bar.basics}
            onChange={(e) => setBar((prev) => ({ ...prev, basics: e.target.checked }))}
          />
          <label htmlFor="bar-basics">I always have {BASICS_LABEL}</label>
        </div>
      </div>

      {quickAdd.length > 0 && (
        <div className="form-group">
          <label>Popular ingredients, tap to add</label>
          <div className="chip-row">
            {quickAdd.map((name) => (
              <button type="button" key={name} className="chip" onClick={() => addItem(name)}>
                + {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {bar.items.length > 0 && (
        <button type="button" className="clear-link" onClick={clearBar}>
          Remove everything from my bar
        </button>
      )}

      <div className="done-bar">
        <Link className="big-button" to="/bar">
          {bar.items.length === 0
            ? "Done"
            : `Done, show the ${readyCount} ${readyCount === 1 ? "drink" : "drinks"} I can make`}
        </Link>
      </div>
    </div>
  );
}
