import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import './edit&create.css';
import { addDrink, getDrinks } from "../drinksApi";
import DrinkForm from "./DrinkForm";

export default function Create() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  // Existing drinks feed ingredient autocomplete, garnish ideas and the duplicate-name check.
  useEffect(() => {
    getDrinks().then(setRecords).catch((error) => console.error("Error loading cocktails:", error));
  }, []);

  async function onSubmit(drink) {
    try {
      await addDrink({ ...drink, glass: drink.glass || undefined });
    } catch (error) {
      window.alert(error);
      return;
    }
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
