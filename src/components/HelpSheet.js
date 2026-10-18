import React from "react";
import Modal from "react-bootstrap/Modal";
import "./RecordList.css";

export default function HelpSheet({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered contentClassName="dark-modal">
      <Modal.Header closeButton>
        <Modal.Title>How to use</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ol>
          <li>Type in the search box to find a cocktail by name or ingredient.</li>
          <li>Tap a booze type (Whiskey, Gin, Rum…) to narrow the list.</li>
          <li>Under “Ingredients I have”, add what's in your kitchen to see what you can make.</li>
          <li>Tap any cocktail to open its full recipe.</li>
          <li>Don't see yours? Tap “+ New cocktail” to add it for everyone.</li>
        </ol>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="modal-btn primary" onClick={onHide}>Got it</button>
      </Modal.Footer>
    </Modal>
  );
}
