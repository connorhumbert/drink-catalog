import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar({ loading }) {
  const { pathname } = useLocation();

  return (
    <>
      <NavLink className="app-header" to="/">
        <img src="/neon-glass.jpg" alt="" />
        <h1 className="app-title">Cocktail Catalog</h1>
      </NavLink>

      {!loading && pathname === "/" && (
        <Link className="fab" to="/create">+ New cocktail</Link>
      )}
    </>
  );
}
