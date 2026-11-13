import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import './edit&create.css';
import { addDrink } from "../drinksApi";
import useDrinks from "../useDrinks";
import useOnline from "../useOnline";
import DrinkForm from "./DrinkForm";

export default function Create() {
  // Existing drinks feed ingredient autocomplete, garnish ideas and the duplicate-name check.
  const { records } = useDrinks();
  const online = useOnline();
  const navigate = useNavigate();

  // Saving needs a connection. If it fails, DrinkForm shows why and keeps what was typed.
  async function onSubmit(drink) {
    await addDrink({ ...drink, glass: drink.glass || undefined });
    navigate("/");
  }

  return (
    <div className="form-page">
      <Link className="back-link" to="/">← Back</Link>
      <h2>Create New Cocktail</h2>
      {!online && (
        <p className="offline-form-note">You're offline. You can fill this in, but you'll need an internet connection to save it.</p>
      )}
      <DrinkForm initial={{}} records={records} submitLabel="Create Cocktail" onSubmit={onSubmit} />
      <p className="form-note">Note: This will create a cocktail visible to all website users.</p>
    </div>
  );
}
