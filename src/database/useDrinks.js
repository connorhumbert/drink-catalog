import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { reconnect, subscribeDrinks } from "./drinksApi";

const DrinksContext = createContext(null);

// How long to wait before starting the live list again after it stopped with an error: quickly at first, then less
// often if it keeps failing.
export const RETRY_DELAYS_MS = [2000, 5000, 15000, 30000, 60000];

// One live list of drinks for the whole app, so switching tabs doesn't reload anything.
// Shows the on-device copy first, then updates from the server (and whenever anyone changes a drink).
export function DrinksProvider({ children }) {
  const [state, setState] = useState({ records: [], loading: true, error: null, fromCache: false });

  // Changing `restarts` starts the live list again. An error stops it for good (Firestore won't resume it), and on
  // iPhones that can happen when Safari's on-device database breaks while the app is in the background. Without a
  // restart the list would quietly stop updating until the app was closed and reopened.
  const [restarts, setRestarts] = useState(0);
  const stopped = useRef(false);
  const failures = useRef(0);

  useEffect(() => {
    stopped.current = false;
    let retryTimer;
    const unsubscribe = subscribeDrinks(
      (records, fromCache) => {
        failures.current = 0;
        setState({ records, loading: false, error: null, fromCache });
      },
      (error) => {
        console.error("Error loading cocktail recipes:", error);
        stopped.current = true;
        setState((prev) => ({ ...prev, loading: false, error }));
        const delay = RETRY_DELAYS_MS[Math.min(failures.current, RETRY_DELAYS_MS.length - 1)];
        failures.current += 1;
        retryTimer = setTimeout(() => setRestarts((n) => n + 1), delay);
      }
    );
    return () => {
      clearTimeout(retryTimer);
      unsubscribe();
    };
  }, [restarts]);

  // Coming back to the app (from another app or a locked phone) or getting signal back: catch up on anything that
  // changed meanwhile. If the list had stopped, start it again now rather than waiting for the next retry.
  useEffect(() => {
    const catchUp = () => {
      if (document.visibilityState !== "visible") return;
      if (stopped.current) setRestarts((n) => n + 1);
      else reconnect();
    };
    document.addEventListener("visibilitychange", catchUp);
    window.addEventListener("online", catchUp);
    return () => {
      document.removeEventListener("visibilitychange", catchUp);
      window.removeEventListener("online", catchUp);
    };
  }, []);

  return <DrinksContext.Provider value={state}>{children}</DrinksContext.Provider>;
}

export default function useDrinks() {
  return useContext(DrinksContext);
}
