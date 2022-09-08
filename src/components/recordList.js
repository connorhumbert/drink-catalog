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
 
 // This method will map out the cocktails on the table
 function recordList(boozeType, filterByIngredient, filterByName) {

  if (boozeType === "None") { //if "None", filter by name OR ingredient else show all
    if (filterByName !== ""){
      console.log(filterByName);
      console.log()
      console.log(mapRecords(records.filter((el) => el.name === filterByName)));
      return mapRecords(records.filter((el) => el.name === filterByName));
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
     <h3>Cocktail List</h3>
     <Dropdown
          label="Filter by Booze "
          options={options}
          value={boozeType}
          onChange={handleAlcoholChange}
        />
      <Form
          onSave = {handleIngredientChange} nameForm = 'Filter by Ingredient '
      />
      <Form
          onSave = {handleNameChange} nameForm = 'Filter by Name '
      />
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
       <tbody>{showChange ? recordList(boozeType, filterByIngredient, filterByName) : <p>Click Start</p>}</tbody>
     </table>
   </div>
 );
}

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Header from './Header';
// import Dropdown from './Dropdown';
// import Button from "./Button";
// import Cocktail from "./Cocktail";
// import Form from "./Form";
// import Matrix from "./Matrix";
// import Popup from "./Popup";

// export default function RecordList() {



//   const [alcohol, setAlcohol] = React.useState("None"); //liquor dropdown
//   const [showChange, setShowChange] = React.useState(false); //inital show button
//   const [drinksArray, setDrinksArray]= React.useState([]); //main array of drinks to be shown
//   const [noFilterSpecified, setNoFilterSpecified] = React.useState(true); //set to false if any filter is specified
//   const [isOpen, setIsOpen] = useState(false); //for popup
//   const [filterStr, setFilterStr] = useState("None");

//   //filter by Ingredient form
//   const onSaveIngredient = (formValue) => {

//     //set alcohol filter to none if filtering by ingredient
//     setAlcohol("None");
//     setNoFilterSpecified(false);
//     setFilterStr(formValue.text);


//     let tempArray = [];
//     let text = formValue.text.toLowerCase();

//     for (var i = 0; i < Drinks.length; i++) { //loop thorugh objects

//       for (const [key, value] of Object.entries(Drinks[i])) {
//         if (key === "ingredients"){
//           value.forEach(element => {
//             if (element.toLowerCase().includes(text)){

//               tempArray.push(Drinks[i].name);

//               }
//             });
//           }
//         }
//       }
//       setDrinksArray(Drinks.filter((value) => tempArray.includes(value.name))
//       .map((val,index) => (
//         <Cocktail key={index} cocktail ={val}/>
//       )));


//   };

//   //filter by name form
//   const onSaveName = (values) => {

//     //set alcohol to none if filtering by name
//     setAlcohol("None");
//     setNoFilterSpecified(false);
//     setFilterStr(values.text);

//     setDrinksArray(Drinks.filter((value) => value.name.toLowerCase().includes(values.text.toLowerCase()))
//     .map((val,index) => (
//       <Cocktail key={index} cocktail ={val}/>
//     )));

//   };

//   const options = [
//     { label: 'None', value: 'None' },
//     { label: 'Tequila', value: 'Tequila' },
//     { label: 'Whiskey/Rye/Bourbon', value: "Whiskey/Rye/Bourbon"},
//     { label: 'Rum', value: 'Rum' },
//     { label: 'Gin', value: 'Gin' },
//     { label: 'Vodka', value: 'Vodka' },
//     { label: 'Wine', value: 'Wine' },
//   ];

//   //for dropdown
//   const handleAlcoholChange = (event) => {

//     setAlcohol(event.target.value);
//     setFilterStr(event.target.value);

//     if (event.target.value === "None") { //dont filter
//       setDrinksArray(Drinks
//       .map((val,index) => (
//         <Cocktail key={index} cocktail ={val}/>
//       )));
//     } else {//filter by alcohol
//       setDrinksArray(Drinks.filter((value) => value.booze === event.target.value)
//       .map((val,index) => (
//         <Cocktail key={index} cocktail ={val}/>
//       )));
//     }
//   };

//   //initial on show button
//   const onShow = () => {
//     if (alcohol === "None" && noFilterSpecified) { //on initial start, if nothing selected show everything
//       setDrinksArray(Drinks
//       .map((val,index) => (
//         <Cocktail key={index} cocktail ={val}/>
//       )));
//     }

//     setShowChange(true);
//   }
  
//   //for pop up
//   const togglePopup = () => {
//     setIsOpen(!isOpen);
//   }
 
//   const infoText = "This application was created as a gift for my family. As of June 23rd 2022, the catalog currently contains 125 cocktails.\n That being said, we're big fans of trying new ones. If you use this application and wish to see more drinks added to it please email connor.catalog@gmail.com a cocktail in this example format: \n Gin and Tonic \n 2 oz gin \n 1/2 oz lime juice \n 4-6 oz tonic \n Garnish: Lime wedge "; 


//   return (
//     <section className = "container">

//       <div className ="left-half">
//       <div>
//         {/* <FaInfo onClick={togglePopup} className="icon-right"></FaInfo> */}
//         {/* <FaInfoCircle onClick={togglePopup} className="icon-right"></FaInfoCircle> */}

//         {isOpen && <Popup
//           content={<> 
//           <body>Hi!</body>
//           <div className="display-linebreak"> 
//             {infoText} 
//           </div>

//           </>} 
//           handleClose={togglePopup}
//         />}
//       </div>
//       <div className="divCenter">
//       <Header/>
//       <Dropdown
//           label="Filter by Liquor "
//           options={options}
//           value={alcohol}
//           onChange={handleAlcoholChange}
//         />
//         <p> </p> 
//       <Form
//           onSave = {onSaveIngredient} nameForm = 'Filter by Ingredient '
//       />
//       <Form
//           onSave = {onSaveName} nameForm = 'Filter by Name '
//       />


//       {!showChange ?  <Button
//           color = 'black' text = 'Start' onClick={onShow}
//       /> : ''}
      
//       {showChange && filterStr!=="None"? <p>Showing results based on: {filterStr}</p>: ''}
//       {showChange ? <Matrix cells={drinksArray} /> : <p>Click Start</p>}

//       </div>

//       </div>

//     </section>


//   );
// }