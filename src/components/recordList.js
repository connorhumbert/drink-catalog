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
    <td>
      <ul>
        {props.record.ingredients?.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </td>
    <td>
      <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
      <button className="btn btn-link" onClick={() => props.handleDelete(props.record._id)}>Delete</button>
    </td>
  </tr>
);

export default function RecordList({ setLoading }) {
  const [loading, setLocalLoading] = useState(true); // Local loading state within RecordList
  const [records, setRecords] = useState([]);
  const [boozeType, setBoozeType] = useState("None");
  const [filterByName, setFilterByName] = useState("");
  const [filterByIngredient, setFilterByIngredient] = useState([]);
  const [popup, setPopup] = useState({
    show: false,
    id: null,
  });

  async function getRecords() {
    try {
      //const startTime = new Date().getTime(); // Capture the start time
      const response = await fetch(`https://drink-catalog-backend.onrender.com/record/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const records = await response.json();
      /* get the api response time - as of Dec 4th 2023 there are 127 cocktails and response time is 201ms
       const endTime = new Date().getTime(); // Capture the end time when the response is received
       const duration = endTime - startTime; // Calculate the duration in milliseconds
       console.log(`Time taken: ${duration}ms`);
      */
      setRecords(records);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  }

  useEffect(() => {
    getRecords();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="custom-spinner"></div>
        <p>Get your shaker and shot glass out while you wait, this application can take up to a minute to come online</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div>There is a big ol' problem, wait up to a minute and then refresh. If nothing appears contact Connor.</div>
    );
  }

  async function deleteRecord(id) {
    await fetch(`https://drink-catalog-backend.onrender.com/${id}`, {
      method: "DELETE"
    });

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  const handleDelete = (id) => {
    setPopup({
      show: true,
      id,
    });
  };

  const handleDeleteTrue = () => {
    if (popup.show && popup.id) {
      deleteRecord(popup.id);
      setPopup({
        show: false,
        id: null,
      });
    }
  };

  const handleDeleteFalse = () => {
    setPopup({
      show: false,
      id: null,
    });
  };

  function recordList() {
    let filteredCocktails = records.slice(); //copy of records
    if (filterByName !== "") {
      filteredCocktails = filteredCocktails.filter((el) => el.name.toLowerCase().includes(filterByName.toLowerCase()));
    }
    if (filterByIngredient.length > 0) {
      let tempArray = [];
      for (var i = 0; i < records.length; i++) {
        for (const [key, value] of Object.entries(records[i])) {
          if (key === "ingredients") {
            let containsAllIngredients = filterByIngredient.every(element =>
              value.some(item => item.toLowerCase().includes(element.toLowerCase()))
            );
            if (containsAllIngredients) {
              tempArray.push(records[i].name);
            }
          }
        }
      }
      filteredCocktails = filteredCocktails.filter((el) => tempArray.includes(el.name));
    }
    if (boozeType !== "None") {
      filteredCocktails = filteredCocktails.filter((el) => el.booze === boozeType);
    }

    const cocktailCount = filteredCocktails.length;

    return {
      filteredCocktails,
      cocktailCount
    };
  }

  const handleSubmit = (data) => {
    setBoozeType(data.boozeType);
    setFilterByIngredient(data.ingredientTextArray);
    setFilterByName(data.nameText);
  };

  const clearFilters = () => {
    setBoozeType("None");
    setFilterByIngredient([]);
    setFilterByName("");
  };

  const { filteredCocktails, cocktailCount } = recordList();

  return (
    <div style={{ padding: '5px' }}>
      <h3 style={{ textAlign: 'center', fontSize: '1.5rem' }}>Cocktail Catalog</h3>
      <p></p>
      <ParentForm onSave={handleSubmit} clearFilters={clearFilters} />
      <div class style={{ textAlign: 'center', marginTop: '10px' }}>
        <label>Number of Cocktails Currently Displayed: {cocktailCount} </label>
      </div>

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

      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table className="table table-striped" style={{ minWidth: '300px' }}>
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Name</th>
              <th>Booze</th>
              <th>Ingredients</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCocktails.map((record) => (
              <Record
                record={record}
                handleDelete={() => handleDelete(record._id)}
                key={record._id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
