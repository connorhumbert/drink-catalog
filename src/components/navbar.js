import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ loading }) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
          <img style={{ "width": 200 }} src="https://m.media-amazon.com/images/I/71Vor1UJfOL._AC_SX522_.jpg" alt="cocktail"></img>
        </NavLink>

        {!loading && (
          <NavLink className="nav-link" to="/create" style={{ color: 'blue', textDecoration: 'underline' }}>
            Create New Cocktail
          </NavLink>
        )}

      </nav>
    </div>
  );
}