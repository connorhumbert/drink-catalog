import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import './edit&create.css';
import { addDrink } from "../drinksApi";

export default function Create() {
  const [form, setForm] = useState({
    name: "",
    ingredients: "",
    booze: "",
  });
  const boozeOptions = [
    { label: 'Whiskey/Rye/Bourbon', value: "Whiskey/Rye/Bourbon" },
    { label: 'Tequila', value: 'Tequila' },
    { label: 'Rum', value: 'Rum' },
    { label: 'Gin', value: 'Gin' },
    { label: 'Vodka', value: 'Vodka' },
    { label: 'Wine', value: 'Wine' },
  ];
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    try {
      await addDrink(form);
    } catch (error) {
      window.alert(error);
      return;
    }

    setForm({ name: "", ingredients: "", booze: "" });
    navigate("/");
  }

  return (
    <div className="form-page">
      <Link className="back-link" to="/">← Back</Link>
      <h2>Create New Cocktail</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            required
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
            required
          />
        </div>
        <div className="form-group">
          <label>Booze Type</label>
          <div className="pill-group">
            {boozeOptions.map((option, index) => (
              <div className="pill" key={option.value}>
                <input
                  type="radio"
                  name="boozeOptions"
                  id={`booze${option.label}`}
                  value={option.value}
                  checked={form.booze === option.value}
                  onChange={(e) => updateForm({ booze: e.target.value })}
                  required={index === 0}
                />
                <label htmlFor={`booze${option.label}`}>{option.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="btn-accent">Create Cocktail</button>
        </div>
      </form>
      <p className="form-note">Note: This will create a cocktail visible to all website users.</p>
    </div>
  );
}