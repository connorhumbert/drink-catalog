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
  const [popup, setPopup] = useState({
    show: false,
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

  useEffect(() => {
    getRecords();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-bar"></div>
        <p style={{marginTop: '10px'}}>Get your shaker and shot glass out while you wait, this application can take up to a minute to boot up</p>
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
    let filteredCocktails;

    if (boozeType === "None") {
      if (filterByName !== "") {
        filteredCocktails = records.filter((el) => el.name.toLowerCase().includes(filterByName));
      } else if (filterByIngredient.length > 0) {
        let tempArray = [];
        for (var i = 0; i < records.length; i++) {
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
        filteredCocktails = records.filter((el) => tempArray.includes(el.name));
      } else {
        filteredCocktails = records;
      }
    } else {
      filteredCocktails = records.filter((el) => el.booze === boozeType);
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
    <div>
      <h3 style={{marginLeft: '8px'}}>Cocktail Catalog</h3>
      <p></p>
      <ParentForm onSave={handleSubmit} clearFilters={clearFilters}/>
      <p></p>
      <p style={{ padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Number of Cocktails Currently Displayed: {cocktailCount}</p>
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
  );
}
