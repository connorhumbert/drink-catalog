import { useState } from 'react';
import './ParentForm.css';

const ParentForm = ({ onSave, clearFilters }) => {
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
              style={{ width: '300px' }}
            />
          </label>
          <button className="info-button" aria-label="Info" style={{ marginTop: '25px' }}>
            <span className="info-icon">&#9432;</span>
            <span className="tooltip-text">Filtering by "mule" will result in drinks such as "Moscow Mule" and "Mexican Mule"</span>
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
              style={{ width: '300px' }}
            />
          </label>
          <button className="info-button" aria-label="Info" style={{ marginTop: '25px' }}>
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
