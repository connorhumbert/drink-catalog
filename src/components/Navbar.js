import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import HelpSheet from "./HelpSheet";

export default function Navbar() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div className="app-header">
        <NavLink className="brand" to="/">
          <img src="/neon-glass.jpg" alt="" />
          <h1 className="app-title">Cocktail Catalog</h1>
        </NavLink>
        <button type="button" className="help-btn" onClick={() => setShowHelp(true)} aria-label="How to use this site">?</button>
      </div>

      <HelpSheet show={showHelp} onHide={() => setShowHelp(false)} />
    </>
  );
}
