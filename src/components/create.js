import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import './edit&create.css';
import { addDrink } from "../drinksApi";
import useDrinks from "../useDrinks";
import DrinkForm from "./DrinkForm";

export default function Create() {
  // Existing drinks feed ingredient autocomplete, garnish ideas and the duplicate-name check.
  const { records } = useDrinks();
  const navigate = useNavigate();

  // Don't wait for the server: offline, the save is queued and only resolves after reconnecting.
  // The new drink shows in the list right away either way.
  function onSubmit(drink) {
    addDrink({ ...drink, glass: drink.glass || undefined }).catch((error) => {
      console.error("Error creating cocktail:", error);
      window.alert(`Couldn't save the cocktail: ${error.message}`);
    });
    navigate("/");
  }

  return (
    <div className="form-page">
      <Link className="back-link" to="/">← Back</Link>
      <h2>Create New Cocktail</h2>
      <DrinkForm initial={{}} records={records} submitLabel="Create Cocktail" onSubmit={onSubmit} />
      <p className="form-note">Note: This will create a cocktail visible to all website users.</p>
    </div>
  );
}
