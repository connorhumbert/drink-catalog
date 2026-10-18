import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const drinksCollection = collection(db, "drinks");

// Firestore sorts strings case-sensitively, so store a lowercase copy of the name to keep alphabetical order.
function toDrinkData({ name, ingredients, booze }) {
  const ingredientList = Array.isArray(ingredients)
    ? ingredients
    : ingredients.split(",");

  return {
    name,
    nameLower: name.toLowerCase(),
    booze,
    ingredients: ingredientList.map((item) => item.trim()).filter(Boolean),
  };
}

function toDrink(snapshot) {
  return { _id: snapshot.id, ...snapshot.data() };
}

export async function getDrinks() {
  const snapshot = await getDocs(query(drinksCollection, orderBy("nameLower")));
  return snapshot.docs.map(toDrink);
}

export async function getDrink(id) {
  const snapshot = await getDoc(doc(db, "drinks", id));
  return snapshot.exists() ? toDrink(snapshot) : null;
}

export function addDrink(drink) {
  return addDoc(drinksCollection, toDrinkData(drink));
}

export function updateDrink(id, drink) {
  return updateDoc(doc(db, "drinks", id), toDrinkData(drink));
}

export function deleteDrink(id) {
  return deleteDoc(doc(db, "drinks", id));
}
