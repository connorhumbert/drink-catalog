import { useState } from 'react';
import './ParentForm.css';

const ParentForm = ({ onSave, clearFilters }) => {
  const [ingredientTextString, setIngredientTextString] = useState("");
  const [nameText, setNameText] = useState("");
  const [boozeType, setBoozeType] = useState("None");

  const handleAlcoholChange = (event) => {
    setBoozeType(event.target.value);
  };

  const options = [
    { label: 'No Selection', value: 'None' },
    { label: 'Whiskey/Rye/Bourbon', value: "Whiskey/Rye/Bourbon" },
    { label: 'Tequila', value: 'Tequila' },
    { label: 'Rum', value: 'Rum' },
    { label: 'Gin', value: 'Gin' },
    { label: 'Vodka', value: 'Vodka' },
    { label: 'Wine', value: 'Wine' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    let ingredientTextArray = [];
    if (ingredientTextString.length !== 0) {
      ingredientTextArray = ingredientTextString
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient !== '');
    }
    onSave({ nameText, ingredientTextArray, boozeType })
  };

  const handleClear = () => {
    setIngredientTextString([]);
    setNameText("");
    setBoozeType("None")

    clearFilters()
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit}>
        <label style={{ position: 'relative' }}>
          {"Filter by Booze Type "}
          <select value={boozeType} onChange={handleAlcoholChange} style={{ position: 'relative', zIndex: 1 }}>
            {options.map((option, index) => (
              <option key={index} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <p></p>
        <label>  {"Filter by Name of Cocktail "}          </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input className="form-control"
            type="text"
            value={nameText}
            onChange={(e) => setNameText(e.target.value)}
            placeholder={"Enter Name"}
          />

          <button className="info-button" aria-label="Info" style={{ marginLeft: '10px' }}>
            <span className="info-icon">&#9432;</span>
            <span className="tooltip-text">Filtering by "Smash" will result in drinks such as "Whiskey Smash" and "Blueberry Smash"</span>
          </button>
        </div>
        <p></p>
        <label>{"Filter by Ingredients"}</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            className="form-control"
            type="text"
            value={ingredientTextString}
            onChange={(e) => setIngredientTextString(e.target.value)}
            placeholder={"Enter Comma Separated List"}
          />
          <button className="info-button" aria-label="Info" style={{ marginLeft: '10px' }}>
            <span className="info-icon">&#9432;</span>
            <span className="tooltip-text">Filtering by "orange juice, lime" will result in drinks such as "Painkiller"</span>
          </button>
        </div>
        <p></p>
        <div className="button-container">
          <button type="button" onClick={handleClear} className="btn btn-outline-secondary" style={{ marginRight: '10px', marginLeft: '75px' }}>Clear</button>
          <input type="submit" value="Submit" className="btn btn-outline-primary" />
        </div>
      </form>
    </div>
  );
};

export default ParentForm;
