import { useEffect, useState } from "react";

// useState that survives switching tabs and reloads for this browser tab, but starts fresh in a new one.
export default function useSessionState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = sessionStorage.getItem(key);
      return saved === null ? initial : JSON.parse(saved);
    } catch (error) {
      return initial;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Private browsing can block storage; the value still works for this visit.
    }
  }, [key, value]);

  return [value, setValue];
}
