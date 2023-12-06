import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ loading }) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand mr-auto" to="/">
          <img style={{ maxWidth: '150px', height: 'auto', marginLeft: '20px' }} src="https://m.media-amazon.com/images/I/71Vor1UJfOL._AC_SX522_.jpg" alt="cocktail"></img>
        </NavLink>

        {!loading && (
          <div className="navbar-nav ml-auto">
            <NavLink className="nav-link" to="/create" style={{ color: 'blue', textDecoration: 'underline', marginRight: '20px' }}>
              Create New Cocktail
            </NavLink>
          </div>
        )}
      </nav>
    </div>
  );
}