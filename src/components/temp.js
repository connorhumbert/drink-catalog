import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from './Dropdown';
import Form from "./Form";
import Button from "./Button";
 
const Record = (props) => (
 <tr>
   <td>{props.record.name}</td>
   <td>{props.record.booze}</td>
   <td>{props.record.ingredients?.map((list,index)=>
            <li key = {index}>{list}</li>  
          )}</td>
   <td>
     <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
     <button className="btn btn-link"
       onClick={() => {
         props.deleteRecord(props.record._id);
       }}
     >
       Delete
     </button>
   </td>
 </tr>
);

const options = [
  { label: 'None', value: 'None' },
  { label: 'Tequila', value: 'Tequila' },
  { label: 'Whiskey/Rye/Bourbon', value: "Whiskey/Rye/Bourbon"},
  { label: 'Rum', value: 'Rum' },
  { label: 'Gin', value: 'Gin' },
  { label: 'Vodka', value: 'Vodka' },
  { label: 'Wine', value: 'Wine' },
];

 
export default function RecordList() {
 const [records, setRecords] = useState([]);
 const [boozeType, setBoozeType] = useState("None");
 const [filterByName, setFilterByName] = useState("");
 const [filterByIngredient, setFilterByIngredient] = useState("");
 const [showChange, setShowChange] = useState(false); //inital show button

 const [form, setForm] = useState({
  name: "",
  ingredients: "",
  booze: "",
  });

 function updateForm(value) {
  return setForm((prev) => {
    return { ...prev, ...value };
  });
 }
 
 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`https://mern-cocktail.herokuapp.com/record/`);
 
     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const records = await response.json();
     setRecords(records);

   }
 
   getRecords();
 
   return;
 }, [records.length]);
 
 // This method will delete a record
 async function deleteRecord(id) {
   await fetch(`https://mern-cocktail.herokuapp.com/${id}`, {
     method: "DELETE"
   });
 
   const newRecords = records.filter((el) => el._id !== id);
   setRecords(newRecords);
 }

 function onSubmit() {
  
 }
 
 // This method will map out the cocktails on the table
 function recordList(boozeType, filterByIngredient, filterByName) {

    if (form.name !== ""){
      console.log(form.name);

      console.log(mapRecords(records.filter((el) => el.name === form.name)));
      return mapRecords(records.filter((el) => el.name === form.name));
    }

    // } else if (filterByIngredient !== ""){

    //     let tempArray = [];
    //     for (var i = 0; i < records.length; i++) { //loop thorugh objects
    //       for (const [key, value] of Object.entries(records[i])) {
    //         if (key === "ingredients"){
    //           value.forEach(element => {
    //             if (element.toLowerCase().includes(filterByIngredient)){
    //               tempArray.push(records[i].name);
    //               }
    //             });
    //           }
    //         }
    //       }
    //       return mapRecords(records.filter((el) => tempArray.includes(el.name)));
    // }
    //else
    return mapRecords(records);
  
    return mapRecords(records);
   return mapRecords(records.filter((el) => el.booze === boozeType));
 }

 const mapRecords = (arr) => {
  // console.log(arr.booze);
  // console.log(arr.ingredients);
  // console.log(arr.name);
  return arr.map((record) => {
    return (
      <Record
        record={record}
        deleteRecord={() => deleteRecord(record._id)}
        key={record._id}
      />
    );
  });
 }

   //initial on show button
  const onShow = () => {
    setShowChange(true);
  }

 const handleAlcoholChange = (event) => {
  setBoozeType(event.target.value);
};

 const handleNameChange = (formValue) => {
  //set alcohol filter to none if filtering by name
  setBoozeType("None");
  setFilterByName(formValue.text.toLowerCase());
 };

 const handleIngredientChange = (formValue) => {
  //set alcohol filter to none if filtering by ingredient
  setBoozeType("None");
  setFilterByIngredient(formValue.text.toLowerCase());
 };
 
 // This following section will display the table with the records of individuals.
 return (
   <div>
     <h3>Cocktail Catalog</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Filter by Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="ingredients">Filter by Ingredient</label>
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
       <div className="form-group">
         <input
           type="submit"
           value="Filter Results"
           className="btn btn-primary"
         />
       </div>
     </form>
      {!showChange ?  <Button
          color = 'white' text = 'Start' onClick={onShow}
      /> : ''}
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Name</th>
           <th>Booze</th>
           <th>Ingredients</th>
           <th>Action</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
   </div>
 );
}
