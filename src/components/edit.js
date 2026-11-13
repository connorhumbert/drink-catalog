import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import './edit&create.css';
import { updateDrink } from "../drinksApi";
import useDrinks from "../useDrinks";
import DrinkForm from "./DrinkForm";

export default function Edit() {
  const { records, loading } = useDrinks();
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id.toString();
  const record = records.find((r) => r._id === id);

  useEffect(() => {
    if (!loading && !record) {
      window.alert(`Record with id ${id} not found`);
      navigate("/");
    }
  }, [loading, record, id, navigate]);

  // Don't wait for the server: offline, the save is queued and only resolves after reconnecting.
  function onSubmit(drink) {
    // Only touch glass when there is one to set, or one to clear; old drinks don't have the field.
    const hadGlass = Boolean(record?.glass);
    updateDrink(id, { ...drink, glass: drink.glass || (hadGlass ? "" : undefined) }).catch((error) => {
      console.error("Error updating cocktail:", error);
      window.alert(`Couldn't save the cocktail: ${error.message}`);
    });
    navigate("/");
  }

  return (
    <div className="form-page">
      <Link className="back-link" to="/">← Back</Link>
      <h2>Update Cocktail</h2>
      {!loading && record && (
        <DrinkForm
          initial={record}
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
