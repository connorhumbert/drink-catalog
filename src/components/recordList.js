import React, { useMemo } from "react";
import Fuse from "fuse.js";
import DrinkList from "./DrinkList";
import SearchBar from "./SearchBar";
import { buildSuggestions, hasIngredient, ingredientName, isGarnish, normalize } from "../ingredients";
import { alsoFinds } from "../synonyms";
import useDrinks from "../useDrinks";
import useSessionState from "../useSessionState";
import { LoadingOrEmpty, OfflineNote } from "./StatusMessages";
import "./RecordList.css";

// The "Drinks" tab: the whole catalog with search and spirit filters.
export default function RecordList() {
  const { records, loading, error, fromCache } = useDrinks();
  // Kept while switching tabs, so coming back from My Bar doesn't lose the search.
  const [boozeType, setBoozeType] = useSessionState("drinks.booze", "None");
  const [query, setQuery] = useSessionState("drinks.query", "");
  const [ingredientTags, setIngredientTags] = useSessionState("drinks.ingredients", []);

  const suggestions = useMemo(() => buildSuggestions(records, { minCount: 2 }), [records]);

  const filteredCocktails = useMemo(() => {
    let results = records;
    if (boozeType !== "None") {
      results = results.filter((el) => el.booze === boozeType);
    }
    if (ingredientTags.length > 0) {
      results = results.filter((el) => ingredientTags.every((tag) => hasIngredient(el.ingredients, tag)));
    }
    const text = query.trim();
    if (text.length > 0) {
      const searchable = results.map((el) => ({
        record: el,
        name: normalize(el.name),
        booze: normalize(el.booze || ""),
        ingredients: (el.ingredients || []).filter((item) => !isGarnish(item)).map((item) => normalize(ingredientName(item))),
      }));
      const fuse = new Fuse(searchable, {
        keys: [
          { name: "name", weight: 0.6 },
          { name: "ingredients", weight: 0.3 },
          { name: "booze", weight: 0.1 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
      const filtered = results;
      results = fuse.search(normalize(text)).map((hit) => hit.item.record);
      // Typing a name with synonyms ("club soda") also lists drinks that use another name for it ("soda water").
      if (alsoFinds(normalize(text)).length > 0) {
        const shown = new Set(results);
        results = [...results, ...filtered.filter((el) => !shown.has(el) && hasIngredient(el.ingredients, text))];
      }
    }
    return results;
  }, [records, boozeType, ingredientTags, query]);

  if (loading || records.length === 0) {
    return <LoadingOrEmpty loading={loading} error={error} fromCache={fromCache} />;
  }

  const clearFilters = () => {
    setBoozeType("None");
    setIngredientTags([]);
    setQuery("");
  };

  return (
    <div className="page">
      <OfflineNote />

      <SearchBar
        query={query}
        setQuery={setQuery}
        booze={boozeType}
        setBooze={setBoozeType}
        tags={ingredientTags}
        setTags={setIngredientTags}
        suggestions={suggestions}
        count={filteredCocktails.length}
        onClear={clearFilters}
      />

      {filteredCocktails.length === 0 && (
        <div className="empty-state">
          No cocktails match.
          <br />
          <button type="button" className="clear-link" onClick={clearFilters}>Clear the search and filters</button>
        </div>
      )}

      <DrinkList records={filteredCocktails} />
    </div>
  );
}
