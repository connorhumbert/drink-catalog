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
        <p className="help-intro">Use the buttons along the bottom of the screen.</p>
        <ul className="help-list">
          <li>
            <strong>🍹 Drinks</strong> shows every cocktail. Type in the search box to find one by name or by an
            ingredient, or tap Whiskey, Gin and so on to see just those.
          </li>
          <li>
            <strong>🍸 My Bar</strong>: tell it what you have at home, and it shows the cocktails you can make right
            now, plus ones that need just one more thing.
          </li>
          <li>
            <strong>＋ Add drink</strong> adds a new recipe for everyone.
          </li>
          <li>Tap any cocktail to see the full recipe.</li>
        </ul>
        <p className="help-version">Version {process.env.REACT_APP_VERSION}</p>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="modal-btn primary" onClick={onHide}>Got it</button>
      </Modal.Footer>
    </Modal>
  );
}
