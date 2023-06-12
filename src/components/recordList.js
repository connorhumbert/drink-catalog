import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ParentForm from "./ParentForm";
import "./RecordList.css";

const Record = (props) => (
  <tr>
    <td>{props.record.name}</td>
    <td>{props.record.booze}</td>
    <td>{props.record.ingredients?.map((list, index) =>
      <li key={index}>{list}</li>
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

export default function RecordList() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [boozeType, setBoozeType] = useState("None");
  const [filterByName, setFilterByName] = useState("");
  const [filterByIngredient, setFilterByIngredient] = useState([]);
  const [numberOfCocktailsThatMatchFilters, setNumberOfCocktailsThatMatchFilters] = useState(0);
  const [popup, setPopup] = useState({
    show: false, // initial values set to false and null
    id: null,
  });

  async function getRecords() {
    try {
      const response = await fetch(`https://drink-catalog-backend.onrender.com/record/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      setRecords(records);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  }

  // This method fetches the records from the database.
  useEffect(() => {
    getRecords();
  }, []);

  if (loading) {
    // Display loading bar or spinner
    return (
      <div className="loading-container">
        <div className="loading-bar"></div>
      </div>
    );
  }

  if (records.length === 0) {
    // Display message when no records are available
    return (
      <div>This Application takes up to a minute to boot up, please wait and then refresh.</div>
    );
  }

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
      if (filterByName !== "") {
        return mapRecords(records.filter((el) => el.name.toLowerCase().includes(filterByName)));
      } else if (filterByIngredient.length > 0) {
        let tempArray = [];
        for (var i = 0; i < records.length; i++) { // loop through objects
          for (const [key, value] of Object.entries(records[i])) {
            if (key === "ingredients") {
              let containsAllIngredients = filterByIngredient.every(element =>
                value.some(item => item.includes(element))
              );
              if (containsAllIngredients) {
                tempArray.push(records[i].name);
              }
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

  const handleSubmit = (data) => {
    setBoozeType(data.boozeType);
    setFilterByIngredient(data.ingredientTextArray);
    setFilterByName(data.nameText);
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3 style={{marginLeft: '8px'}}>Cocktail Catalog</h3>
      <p></p>
      <ParentForm onSave={handleSubmit} />
      <p></p>
      <p>Total # of Cocktails: {records.length}</p>
      <p></p>

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
