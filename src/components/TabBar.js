import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./TabBar.css";

const TABS = [
  { to: "/", label: "Drinks", icon: "🍹", end: true },
  { to: "/bar", label: "My Bar", icon: "🍸" },
  { to: "/create", label: "Add drink", icon: "＋" },
];

const TYPING_FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]), textarea, select';

// Phone browsers can leave a fixed bottom bar floating over the keyboard, so hide it while someone is typing.
function useTyping() {
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const onFocusIn = (e) => setTyping(Boolean(e.target.matches?.(TYPING_FIELD)));
    const onFocusOut = (e) => setTyping(Boolean(e.relatedTarget?.matches?.(TYPING_FIELD)));
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);
  return typing;
}

export default function TabBar() {
  const typing = useTyping();
  if (typing) return null;

  return (
    <nav className="tab-bar" aria-label="Main">
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className="tab">
          <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
