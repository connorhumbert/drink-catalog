import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import './edit&create.css';
import { getDrinks, updateDrink } from "../drinksApi";
import DrinkForm from "./DrinkForm";

export default function Edit() {
  const [records, setRecords] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id.toString();

  useEffect(() => {
    async function fetchData() {
      const all = await getDrinks();
      if (!all.some((record) => record._id === id)) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setRecords(all);
    }

    fetchData();
  }, [id, navigate]);

  async function onSubmit(drink) {
    // Only touch glass when there is one to set, or one to clear; old drinks don't have the field.
    const hadGlass = Boolean(records.find((record) => record._id === id)?.glass);
    await updateDrink(id, { ...drink, glass: drink.glass || (hadGlass ? "" : undefined) });
    navigate("/");
  }

  return (
    <div className="form-page">
      <Link className="back-link" to="/">← Back</Link>
      <h2>Update Cocktail</h2>
      {records && (
        <DrinkForm
          initial={records.find((record) => record._id === id)}
          records={records}
          excludeId={id}
          submitLabel="Update Cocktail"
          onSubmit={onSubmit}
        />
      )}
      <p className="form-note">Note: This will edit the cocktail for everyone who uses this website.</p>
    </div>
  );
}
