import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import DrinkCard from "./DrinkCard";
import { deleteDrink } from "../drinksApi";
import { deleteErrorMessage } from "../saving";
import useOnline from "../useOnline";
import "./RecordList.css";

// Cards with Edit and Delete. `missing` (optional) maps drink id -> ingredients the user still needs.
export default function DrinkList({ records, missing }) {
  const [openId, setOpenId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const online = useOnline();

  const askToDelete = (drink) => {
    setDeleteError("");
    setToDelete(drink);
  };

  const closeDelete = () => {
    if (!deleting) setToDelete(null);
  };

  // Deleting needs a connection. The dialog stays open until the server confirms, and shows why if it couldn't.
  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteDrink(toDelete.id);
      setToDelete(null);
    } catch (error) {
      console.error("Error deleting cocktail:", error);
      setDeleteError(deleteErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Modal show={toDelete !== null} onHide={closeDelete} centered contentClassName="dark-modal">
        <Modal.Header closeButton>
          <Modal.Title>Delete {toDelete?.name || "this cocktail"}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {online
            ? "This will delete the cocktail for everyone that uses this website. This can't be undone."
            : "You're offline. Connect to the internet to delete cocktails."}
          {deleteError && <p className="modal-error" role="alert">{deleteError}</p>}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="modal-btn" onClick={closeDelete} disabled={deleting}>
            {online ? "Cancel" : "OK"}
          </button>
          {online && (
            <button type="button" className="modal-btn danger" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
        </Modal.Footer>
      </Modal>

      {records.map((record) => (
        <DrinkCard
          key={record._id}
          record={record}
          open={openId === record._id}
          missing={missing?.get(record._id)}
          onToggle={() => setOpenId(openId === record._id ? null : record._id)}
          onDelete={() => askToDelete({ id: record._id, name: record.name })}
        />
      ))}
    </>
  );
}
