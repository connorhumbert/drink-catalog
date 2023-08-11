import React, { useState } from "react";
import { useNavigate } from "react-router";
 
export default function Create() {
 const [form, setForm] = useState({
   name: "",
   ingredients: "",
   booze: "",
 });
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
 
 // This following section will display the form that takes the input from the user.
 return (
   <div style={{marginLeft: '8px'}}>
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
         <label htmlFor="ingredients">Ingredients (Please enter ingredients as a comma seperated list)</label>
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
       <p></p>
       <div className="form-group">
         <input
           type="submit"
           value="Create Cocktail"
           className="btn btn-primary"
         />
       </div>
     </form>
     <p></p>
     <p>Note: this will create a cocktail that everyone who uses this website will be able to see</p>
   </div>
 );
}