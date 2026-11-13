import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { ConflictError, DeletedError, sameRecipe, withTimeout } from "./saving";

const drinksCollection = collection(db, "drinks");

// Firestore sorts strings case-sensitively, so store a lowercase copy of the name to keep alphabetical order.
function toDrinkData({ name, ingredients, booze, glass }) {
  const ingredientList = Array.isArray(ingredients)
    ? ingredients
    : ingredients.split(",");

  const data = {
    name,
    nameLower: name.toLowerCase(),
    booze,
    ingredients: ingredientList.map((item) => item.trim()).filter(Boolean),
  };
  // Firestore rejects undefined, so only send glass when there is one. An empty string clears it on edit.
  if (glass !== undefined) data.glass = glass;
  return data;
}

function toDrink(snapshot) {
  return { _id: snapshot.id, ...snapshot.data() };
}

const drinksByName = query(drinksCollection, orderBy("nameLower"));

// Calls onChange with the copy saved on this device right away, then again whenever the server copy changes.
// `fromCache` turns false once the server has confirmed the list, which the Edit page waits for.
// Returns an unsubscribe function.
export function subscribeDrinks(onChange, onError) {
  return onSnapshot(
    drinksByName,
    { includeMetadataChanges: true },
    (snapshot) => onChange(snapshot.docs.map(toDrink), snapshot.metadata.fromCache),
    onError
  );
}

// Adding, editing and deleting run as transactions. A transaction reads from the server first, so with no connection
// it fails right away instead of being queued on the device and sent later over someone else's newer changes.

export function addDrink(drink) {
  const ref = doc(drinksCollection);
  return withTimeout(
    runTransaction(db, async (transaction) => {
      await transaction.get(ref);
      transaction.set(ref, { ...toDrinkData(drink), createdAt: serverTimestamp() });
    })
  );
}

// `original` is the drink as it was when the form opened. If the server copy is different now, someone else changed
// it in the meantime, so nothing is saved and ConflictError is thrown.
export function updateDrink(id, drink, original) {
  const ref = doc(db, "drinks", id);
  return withTimeout(
    runTransaction(db, async (transaction) => {
      const current = await transaction.get(ref);
      if (!current.exists()) throw new DeletedError();
      if (original && !sameRecipe(current.data(), original)) throw new ConflictError();
      transaction.update(ref, toDrinkData(drink));
    })
  );
}

export function deleteDrink(id) {
  const ref = doc(db, "drinks", id);
  return withTimeout(
    runTransaction(db, async (transaction) => {
      const current = await transaction.get(ref);
      if (!current.exists()) return;
      transaction.delete(ref);
    })
  );
}
