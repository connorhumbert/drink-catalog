import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import './edit&create.css';
import { updateDrink } from "../drinksApi";
import useDrinks from "../useDrinks";
import useOnline from "../useOnline";
import DrinkForm from "./DrinkForm";

const SLOW_MS = 10000;

export default function Edit() {
  const { records, loading, fromCache } = useDrinks();
  const online = useOnline();
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id.toString();
  const record = records.find((r) => r._id === id);

  // The drink as it was when the form opened. The form only opens once the server has confirmed the latest version,
  // never from the copy saved on this device, which may be out of date. Saving checks nobody changed it since.
  const [opened, setOpened] = useState(null);
  useEffect(() => {
    if (!opened && record && !fromCache) setOpened(record);
  }, [opened, record, fromCache]);

  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), SLOW_MS);
    return () => clearTimeout(timer);
  }, []);

  // Saving needs a connection. If it fails, DrinkForm shows why and keeps what was typed.
  async function onSubmit(drink) {
    // Only touch glass when there is one to set, or one to clear; old drinks don't have the field.
    const hadGlass = Boolean(opened.glass);
    await updateDrink(id, { ...drink, glass: drink.glass || (hadGlass ? "" : undefined) }, opened);
    navigate("/");
  }

  let body;
  if (opened) {
    body = (
      <DrinkForm initial={opened} records={records} excludeId={id} submitLabel="Update Cocktail" onSubmit={onSubmit} />
    );
  } else if (!loading && !fromCache && !record) {
    body = <p className="offline-form-note">This cocktail couldn't be found. Someone may have deleted it.</p>;
  } else if (!online) {
    body = <p className="offline-form-note">You're offline. Connect to the internet to change this cocktail.</p>;
  } else {
    body = (
      <div className="loading-latest">
        <div className="custom-spinner"></div>
        <p>{slow ? "Still loading. Check your internet connection." : "Loading the latest version…"}</p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <Link className="back-link" to="/">← Back</Link>
      <h2>Update Cocktail</h2>
      {body}
      <p className="form-note">Note: This will edit the cocktail for everyone who uses this website.</p>
    </div>
  );
}
