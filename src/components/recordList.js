import React, { useEffect, useMemo, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Fuse from "fuse.js";
import DrinkCard from "./DrinkCard";
import SearchBar from "./SearchBar";
import { getDrinks, deleteDrink, likeDrink } from "../drinksApi";
import { buildSuggestions, hasIngredient, ingredientName, isGarnish, normalize } from "../ingredients";
import "./RecordList.css";

export default function RecordList({ setLoading }) {
  const [loading, setLocalLoading] = useState(true); // Local loading state within RecordList
  const [records, setRecords] = useState([]);
  const [boozeType, setBoozeType] = useState("None");
  const [query, setQuery] = useState("");
  const [ingredientTags, setIngredientTags] = useState([]);
  const [openId, setOpenId] = useState(null);
  // Kept in memory only, so a refresh lets someone like again.
  const [likedIds, setLikedIds] = useState([]);
  const [popup, setPopup] = useState({
    show: false,
    id: null,
    name: "",
  });

  async function getRecords() {
    try {
      const records = await getDrinks();
      setRecords(records);
    } catch (error) {
      console.error("Error fetching cocktail recipes:", error);
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  }

  useEffect(() => {
    getRecords();
    // eslint-disable-next-line
  }, []);

  const suggestions = useMemo(() => buildSuggestions(records), [records]);

  const filteredCocktails = useMemo(() => {
    let results = records;
    if (boozeType !== "None") {
      results = results.filter((el) => el.booze === boozeType);
    }
    if (ingredientTags.length > 0) {
      results = results.filter((el) => ingredientTags.every((tag) => hasIngredient(el.ingredients, tag)));
    }
    const text = query.trim();
    if (text.length > 0) {
      const searchable = results.map((el) => ({
        record: el,
        name: normalize(el.name),
        booze: normalize(el.booze || ""),
        ingredients: (el.ingredients || []).filter((item) => !isGarnish(item)).map((item) => normalize(ingredientName(item))),
      }));
      const fuse = new Fuse(searchable, {
        keys: [
          { name: "name", weight: 0.6 },
          { name: "ingredients", weight: 0.3 },
          { name: "booze", weight: 0.1 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
      results = fuse.search(normalize(text)).map((hit) => hit.item.record);
    }
    return results;
  }, [records, boozeType, ingredientTags, query]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="custom-spinner"></div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="empty-state">There is a big ol' problem, wait up to a minute and then refresh. If nothing appears contact Connor.</div>
    );
  }

  async function deleteRecord(id) {
    await deleteDrink(id);

    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  const handleDelete = (id) => {
    const record = records.find((el) => el._id === id);
    setPopup({
      show: true,
      id,
      name: record ? record.name : "",
    });
  };


  const handleDeleteTrue = () => {
    if (popup.show && popup.id) {
      deleteRecord(popup.id);
      setPopup({
        show: false,
        id: null,
        name: "",
      });
    }
  };

  const handleDeleteFalse = () => {
    setPopup({
      show: false,
      id: null,
      name: "",
    });
  };

  const handleLike = (id) => {
    if (likedIds.includes(id)) return;
    setLikedIds([...likedIds, id]);
    setRecords((prev) => prev.map((el) => (el._id === id ? { ...el, likes: (el.likes || 0) + 1 } : el)));
    likeDrink(id).catch((error) => console.error("Error liking cocktail:", error));
  };

  const clearFilters = () => {
    setBoozeType("None");
    setIngredientTags([]);
    setQuery("");
  };

  return (
    <div className="page">
      <SearchBar
        query={query}
        setQuery={setQuery}
        booze={boozeType}
        setBooze={setBoozeType}
        tags={ingredientTags}
        setTags={setIngredientTags}
        suggestions={suggestions}
        count={filteredCocktails.length}
        onClear={clearFilters}
      />

      <Modal show={popup.show} onHide={handleDeleteFalse} centered contentClassName="dark-modal">
        <Modal.Header closeButton>
          <Modal.Title>Delete {popup.name || "this cocktail"}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This will delete the cocktail for everyone that uses this website. This can't be undone.</Modal.Body>
        <Modal.Footer>
          <button type="button" className="modal-btn" onClick={handleDeleteFalse}>Cancel</button>
          <button type="button" className="modal-btn danger" onClick={handleDeleteTrue}>Delete</button>
        </Modal.Footer>
      </Modal>

      {filteredCocktails.length === 0 && (
        <div className="empty-state">No cocktails match. Try fewer ingredients or a different spelling.</div>
      )}

      {filteredCocktails.map((record) => (
        <DrinkCard
          key={record._id}
          record={record}
          open={openId === record._id}
          liked={likedIds.includes(record._id)}
          onLike={() => handleLike(record._id)}
          onToggle={() => setOpenId(openId === record._id ? null : record._id)}
          onDelete={() => handleDelete(record._id)}
        />
      ))}
    </div>
  );
}
