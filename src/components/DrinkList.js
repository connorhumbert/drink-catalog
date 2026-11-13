import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import DrinkCard from "./DrinkCard";
import { deleteDrink, likeDrink } from "../drinksApi";
import useSessionState from "../useSessionState";
import "./RecordList.css";

// Cards with Like and Delete. `missing` (optional) maps drink id -> ingredients the user still needs.
export default function DrinkList({ records, missing }) {
  const [openId, setOpenId] = useState(null);
  // Kept for this browser tab only, so a new visit lets someone like again.
  const [likedIds, setLikedIds] = useSessionState("likedIds", []);
  const [toDelete, setToDelete] = useState(null);

  // The live list shows the new count right away, even offline.
  const handleLike = (id) => {
    if (likedIds.includes(id)) return;
    setLikedIds([...likedIds, id]);
    likeDrink(id).catch((error) => console.error("Error liking cocktail:", error));
  };

  // The live list drops the drink as soon as it's deleted locally. The server catches up when it can.
  const confirmDelete = () => {
    const { id } = toDelete;
    setToDelete(null);
    deleteDrink(id).catch((error) => {
      console.error("Error deleting cocktail:", error);
      window.alert(`Couldn't delete the cocktail: ${error.message}`);
    });
  };

  return (
    <>
      <Modal show={toDelete !== null} onHide={() => setToDelete(null)} centered contentClassName="dark-modal">
        <Modal.Header closeButton>
          <Modal.Title>Delete {toDelete?.name || "this cocktail"}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This will delete the cocktail for everyone that uses this website. This can't be undone.</Modal.Body>
        <Modal.Footer>
          <button type="button" className="modal-btn" onClick={() => setToDelete(null)}>Cancel</button>
          <button type="button" className="modal-btn danger" onClick={confirmDelete}>Delete</button>
        </Modal.Footer>
      </Modal>

      {records.map((record) => (
        <DrinkCard
          key={record._id}
          record={record}
          open={openId === record._id}
          liked={likedIds.includes(record._id)}
          missing={missing?.get(record._id)}
          onLike={() => handleLike(record._id)}
          onToggle={() => setOpenId(openId === record._id ? null : record._id)}
          onDelete={() => setToDelete({ id: record._id, name: record.name })}
        />
      ))}
    </>
  );
}
