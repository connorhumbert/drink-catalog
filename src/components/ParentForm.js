import { useState } from 'react';
import './ParentForm.css';

const ParentForm = ({ onSave , clearFilters}) => {
  const [ingredientTextArray, setIngredientTextArray] = useState([]);
  const [nameText, setNameText] = useState("");
  const [boozeType, setBoozeType] = useState("None");

  const handleAlcoholChange = (event) => {
    setBoozeType(event.target.value);
  };

  const options = [
    { label: 'None', value: 'None' },
    { label: 'Tequila', value: 'Tequila' },
    { label: 'Whiskey/Rye/Bourbon', value: "Whiskey/Rye/Bourbon" },
    { label: 'Rum', value: 'Rum' },
    { label: 'Gin', value: 'Gin' },
    { label: 'Vodka', value: 'Vodka' },
    { label: 'Wine', value: 'Wine' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform the necessary actions with the submitted data
    onSave({ nameText, ingredientTextArray, boozeType })
  };

  const handleClear = () => {
    // Clear the form inputs
    setIngredientTextArray([]);
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
        <div className="input-group">
          <label style={{ marginRight: '10px' }}>  {"Filter by Name of Cocktail "}
            <input className="form-control"
              type="text"
              value={nameText}
              onChange={(e) => setNameText(e.target.value)}
              placeholder={"Enter Name"}
              style={{ width: '300px' }} // Apply inline style to set the width
            />
          </label>
          <button class="info-button" aria-label="Info">
            <span class="info-icon">&#9432;</span>
            <span class="tooltip-text">Filtering by "summer" will result in drinks such as "Summer Breeze"</span>
          </button>
        </div>
        <p></p>
        <div className="input-group">
          <label style={{ marginRight: '10px', alignSelf: 'center' }}>
            {"Filter by Ingredients"}
            <input
              className="form-control"
              type="text"
              value={ingredientTextArray.join(', ')}
              onChange={(e) => setIngredientTextArray(e.target.value.split(', '))}
              placeholder={"Enter Comma Seperated List"}
              style={{ width: '300px' }} // Apply inline style to set the width
            />
          </label>
          <button class="info-button" aria-label="Info">
            <span class="info-icon">&#9432;</span>
            <span class="tooltip-text">Filtering by "orange juice, lime" will result in drinks such as "Painkiller"</span>
          </button>
        </div>
        <p></p>
        <div className="button-container">
          <input type="submit" value="Submit" className="btn btn-outline-primary" style={{ marginRight: '10px', marginLeft: '65px' }} />
          <button type="button" onClick={handleClear} className="btn btn-outline-secondary" >Clear</button>
        </div>
      </form>
    </div>
  );
};

export default ParentForm;
