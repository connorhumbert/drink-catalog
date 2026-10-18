import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import './edit&create.css';
import { getDrink, updateDrink } from "../drinksApi";

export default function Edit() {
  const [form, setForm] = useState({
    name: "",
    ingredients: "",
    booze: "",
    records: [],
  });
  const params = useParams();
  const navigate = useNavigate();
  const boozeOptions = [
    { label: 'Whiskey/Rye/Bourbon', value: "Whiskey/Rye/Bourbon" },
    { label: 'Tequila', value: 'Tequila' },
    { label: 'Rum', value: 'Rum' },
    { label: 'Gin', value: 'Gin' },
    { label: 'Vodka', value: 'Vodka' },
    { label: 'Wine', value: 'Wine' },
  ];

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const record = await getDrink(id);

      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      let editedRecord = record;
      editedRecord.ingredients = Object.values(record.ingredients).join(', ');
      setForm(editedRecord);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    await updateDrink(params.id.toString(), {
      name: form.name,
      ingredients: form.ingredients,
      booze: form.booze,
    });
    navigate("/");
  }

  return (
    <div className="form-page">
      <Link className="back-link" to="/">← Back</Link>
      <h2>Update Cocktail</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ingredients">Ingredients (separate with commas)</label>
          <textarea
            rows={4}
            className="form-control"
            id="ingredients"
            value={form.ingredients}
            onChange={(e) => updateForm({ ingredients: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Booze Type</label>
          <div className="pill-group">
            {boozeOptions.map((option) => (
              <div className="pill" key={option.value}>
                <input
                  type="radio"
                  name="boozeOptions"
                  id={`booze${option.label}`}
                  value={option.value}
                  checked={form.booze === option.value}
                  onChange={(e) => updateForm({ booze: e.target.value })}
                  
                />
                <label htmlFor={`booze${option.label}`}>{option.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="btn-accent">Update Cocktail</button>
        </div>
      </form>
      <p className="form-note">Note: This will edit the cocktail for everyone who uses this website.</p>
    </div>
  );
}