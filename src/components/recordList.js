import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from './Dropdown';
import Form from "./Form";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { NavLink } from "react-router-dom";
 
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
         props.handleDelete(props.record._id);
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
 const [popup, setPopup] = useState({
  show: false, // initial values set to false and null
  id: null,
 } );

 async function getRecords() {
  const response = await fetch(`https://drink-catalog-backend.onrender.com/record/`);

  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }

  const records = await response.json();
  setRecords(records);

}
 
 // This method fetches the records from the database.
 useEffect(() => {
   getRecords();
 
   return;
 }, [records.length]);
 
 // This method will delete a record
 async function deleteRecord(id) {
   await fetch(`https://drink-catalog-backend.onrender.com/${id}`, {
     method: "DELETE"
   });
 
   const newRecords = records.filter((el) => el._id !== id);
   setRecords(newRecords);
 }

// This will show the Cofirmation Box for deletion
const handleDelete = (id) => {
  setPopup({
    show: true,
    id,
  });
};

// This will perform the deletion and hide the Confirmation Box
const handleDeleteTrue = () => {
  if (popup.show && popup.id) {
    deleteRecord(popup.id);
    setPopup({
      show: false,
      id: null,
    });
  }
};

// This will just hide the Confirmation Box when user clicks "No"/"Cancel"
const handleDeleteFalse = () => {
  setPopup({
    show: false,
    id: null,
  });
};
 
 // This method will map out the cocktails on the table
 function recordList() {

  if (boozeType === "None") { //if "None", filter by name OR ingredient else show all
    if (filterByName !== ""){
      return mapRecords(records.filter((el) => el.name.toLowerCase().includes(filterByName)));
    } else if (filterByIngredient !== ""){
        let tempArray = [];
        for (var i = 0; i < records.length; i++) { //loop thorugh objects
          for (const [key, value] of Object.entries(records[i])) {
            if (key === "ingredients"){
              value.forEach(element => {
                if (element.toLowerCase().includes(filterByIngredient)){
                  tempArray.push(records[i].name);
                  }
                });
              }
            }
          }
          return mapRecords(records.filter((el) => tempArray.includes(el.name)));
    }
    //else
    return mapRecords(records);
  }
   return mapRecords(records.filter((el) => el.booze === boozeType));
 }

 const mapRecords = (arr) => {
  return arr.map((record) => {
    return (
      <Record
        record={record}
        handleDelete={() => handleDelete(record._id)}
        key={record._id}
      />
    );
  });
 }

 const handleAlcoholChange = (event) => {
  setBoozeType(event.target.value);
  setFilterByIngredient("");
  setFilterByName("");
};

 const handleNameChange = (formValue) => {
  //set alcohol filter to none if filtering by name
  setBoozeType("None");
  setFilterByIngredient("");
  setFilterByName(formValue.text.toLowerCase());
 };

 const handleIngredientChange = (formValue) => {
  //set alcohol filter to none if filtering by ingredient
  setBoozeType("None");
  setFilterByName("");
  setFilterByIngredient(formValue.text.toLowerCase());
 };
 
 // This following section will display the table with the records of individuals.
 return (
   <div>
     <h3>Cocktail List</h3>
     
     <p></p>
     <Dropdown
          label="Filter by Booze "
          options={options}
          value={boozeType}
          onChange={handleAlcoholChange}
        />
        <p></p>
      <Form
          onSave = {handleIngredientChange} nameForm = 'Filter by Ingredient '
      />
      <p></p>
      <Form
          onSave = {handleNameChange} nameForm = 'Filter by Name '
      />

      <Modal show={popup.show} onHide={handleDeleteFalse}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>This will delete the cocktail for everyone that uses this website, are you sure you want to continue?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteFalse}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTrue}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <p></p>
      <p>Current Total # of Cocktails: {records.length}</p>
      <p></p>
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
