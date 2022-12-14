import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
 
export default function Edit() {
 const [form, setForm] = useState({
   name: "",
   ingredients: "",
   booze: "",
   records: [],
 });
 const params = useParams();
 const navigate = useNavigate();
 
 useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`https://drink-catalog-backend.onrender.com/record/${params.id.toString()}`);
 
     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const record = await response.json();
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
   const editedPerson = {
     name: form.name,
     ingredients: form.ingredients,
     booze: form.booze,
   };
 
   // This will send a post request to update the data in the database.
   await fetch(`https://mern-cocktail.herokuapp.com/update/${params.id}`, {
     method: "POST",
     body: JSON.stringify(editedPerson),
     headers: {
       'Content-Type': 'application/json'
     },
   });
 
   navigate("/");
 }
 
 // This following section will display the form that takes input from the user to update the data.
 return (
   <div>
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
         <label htmlFor="ingredients">Ingredients (Please enter ingredients as a comma seperated list)</label>
         <input
           type="text"
           className="form-control"
           id="ingredients"
           value={form.ingredients}
           onChange={(e) => updateForm({ ingredients: e.target.value })}
         />
       </div>
       <div className="form-group">
       <div className="form-check form-check-inline">
           <input
             className="form-check-input"
             type="radio"
             name="boozeOptions"
             id="boozeBOURBON/RYE/WHISKEY"
             value="Whiskey/Rye/Bourbon"
             checked={form.booze === "Whiskey/Rye/Bourbon"}
             onChange={(e) => updateForm({ booze: e.target.value })}
           />
           <label htmlFor="booze" className="form-check-label">WHISKEY/BOURBON/RYE</label>
         </div>
         <div className="form-check form-check-inline">
          <input
             className="form-check-input"
             type="radio"
             name="boozeOptions"
             id="boozeTEQUILA"
             value="Tequila"
             checked={form.booze === "Tequila"}
             onChange={(e) => updateForm({ booze: e.target.value })}
           />
           <label htmlFor="booze" className="form-check-label">TEQUILA</label>
         </div>
         <div className="form-check form-check-inline">
          <input
             className="form-check-input"
             type="radio"
             name="boozeOptions"
             id="boozeGIN"
             value="Gin"
             checked={form.booze === "Gin"}
             onChange={(e) => updateForm({ booze: e.target.value })}
           />
           <label htmlFor="booze" className="form-check-label">GIN</label>
         </div>
         <div className="form-check form-check-inline">
          <input
             className="form-check-input"
             type="radio"
             name="boozeOptions"
             id="boozeRUM"
             value="Rum"
             checked={form.booze === "Rum"}
             onChange={(e) => updateForm({ booze: e.target.value })}
           />
           <label htmlFor="booze" className="form-check-label">RUM</label>
         </div>
         <div className="form-check form-check-inline">
          <input
             className="form-check-input"
             type="radio"
             name="boozeOptions"
             id="boozeVODKA"
             value="Vodka"
             checked={form.booze === "Vodka"}
             onChange={(e) => updateForm({ booze: e.target.value })}
           />
           <label htmlFor="booze" className="form-check-label">VODKA</label>
         </div>
         <div className="form-check form-check-inline">
          <input
             className="form-check-input"
             type="radio"
             name="boozeOptions"
             id="boozeWINE"
             value="Wine"
             checked={form.booze === "Wine"}
             onChange={(e) => updateForm({ booze: e.target.value })}
           />
           <label htmlFor="booze" className="form-check-label">WINE</label>
         </div>
       </div>
       <br />
 
       <div className="form-group">
         <input
           type="submit"
           value="Update Cocktail"
           className="btn btn-primary"
         />
       </div>
     </form>
     <p></p>
     <p>Note: this will edit the cocktail for everyone who uses this website</p>
   </div>
 );
}