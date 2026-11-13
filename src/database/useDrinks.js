import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeDrinks } from "./drinksApi";

const DrinksContext = createContext(null);

// One live list of drinks for the whole app, so switching tabs doesn't reload anything.
// Shows the on-device copy first, then updates from the server (and whenever anyone changes a drink).
export function DrinksProvider({ children }) {
  const [state, setState] = useState({ records: [], loading: true, error: null, fromCache: false });

  useEffect(
    () =>
      subscribeDrinks(
        (records, fromCache) => setState({ records, loading: false, error: null, fromCache }),
        (error) => {
          console.error("Error loading cocktail recipes:", error);
          setState((prev) => ({ ...prev, loading: false, error }));
        }
      ),
    []
  );

  return <DrinksContext.Provider value={state}>{children}</DrinksContext.Provider>;
}

export default function useDrinks() {
  return useContext(DrinksContext);
}
