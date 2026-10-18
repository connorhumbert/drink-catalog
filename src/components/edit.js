import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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
      editedRecord.ingredients = Object.values(record.ingredients).join(',');
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
    <div style={{ marginLeft: '8px' }}>
      <h3>Update Cocktail</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
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
          />
        </div>
        <div className="form-group">
          <label>Booze</label>
          <div style={{ marginBottom: '10px' }}>
            {boozeOptions.map((option) => (
              <div className="form-check" key={option.value} style={{ marginBottom: '5px' }}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="boozeOptions"
                  id={`booze${option.label}`}
                  value={option.value}
                  checked={form.booze === option.value}
                  onChange={(e) => updateForm({ booze: e.target.value })}
                />
                <label htmlFor={`booze${option.label}`} className="form-check-label" style={{ marginLeft: '5px' }}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <input type="submit" value="Update Cocktail" className="btn btn-primary btn-block" />
        </div>
      </form>
      <p style={{ marginTop: '10px' }}>Note: This will edit the cocktail for everyone who uses this website.</p>
    </div>
  );
}