import React, { useMemo } from "react";
import DrinkList from "../../components/DrinkList";
import SearchBar from "./SearchBar";
import { buildSuggestions, hasIngredient } from "../../recipes/ingredients";
import { searchByText } from "../../recipes/search";
import useDrinks from "../../database/useDrinks";
import useSessionState from "../../hooks/useSessionState";
import { LoadingOrEmpty, OfflineNote } from "../../components/StatusMessages";
import "../../components/RecordList.css";

// The "Drinks" tab: the whole catalog with search and spirit filters.
export default function DrinksTab() {
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
    return searchByText(results, query);
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
