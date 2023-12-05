import React, { useState } from "react";
import { useNavigate } from "react-router";

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

    // When a post request is sent to the create url, we'll add a new record to the database.
    const newCocktail = { ...form };


    await fetch("https://drink-catalog-backend.onrender.com/record/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCocktail),
    })
      .catch(error => {
        window.alert(error);
        return;
      });

    setForm({ name: "", ingredients: "", booze: "" });
    navigate("/");
  }

  return (
    <div style={{ margin: '8px' }}>
      <h3>Create New Cocktail</h3>
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
          <label htmlFor="ingredients">Ingredients (Comma-separated)</label>
          <input
            type="text"
            className="form-control"
            id="ingredients"
            value={form.ingredients}
            onChange={(e) => updateForm({ ingredients: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Booze Type</label>
          <div style={{ marginBottom: '10px' }}>
            {boozeOptions.map((option, index) => (
              <div className="form-check" key={option.value} style={{ marginBottom: '5px' }}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="boozeOptions"
                  id={`booze${option.label}`}
                  value={option.value}
                  checked={form.booze === option.value}
                  onChange={(e) => updateForm({ booze: e.target.value })}
                  required={index === 0} // Make the first radio button required
                />
                <label htmlFor={`booze${option.label}`} className="form-check-label" style={{ marginLeft: '5px' }}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <input type="submit" value="Create Cocktail" className="btn btn-primary btn-block" />
        </div>
      </form>
      <p style={{ marginTop: '10px' }}>Note: This will create a cocktail visible to all website users.</p>
    </div>
  );
}