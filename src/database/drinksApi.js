import {
  collection,
  deleteDoc,
  disableNetwork,
  doc,
  enableNetwork,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { ConflictError, DeletedError, sameRecipe, toDrinkData, withTimeout } from "./saving";

const drinksCollection = collection(db, "drinks");

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

// Restarts the connection that keeps the list live, so it catches up with the server. Needed because:
// - a transaction's change isn't added to the list on this phone; it arrives through that connection like anyone
//   else's change would, and
// - iPhones can leave the connection frozen after the app has been in the background, so nothing arrives until the
//   app is restarted.
// Cheap: the server only sends what changed. Never throws.
export async function reconnect() {
  try {
    await disableNetwork(db);
    await enableNetwork(db);
  } catch (error) {
    console.error("Couldn't reconnect to the database:", error);
  }
}

// After a save, catch the list up straight away rather than waiting on a connection that may be frozen.
async function saveThenRefresh(save) {
  await withTimeout(save);
  reconnect();
}

export function addDrink(drink) {
  const ref = doc(drinksCollection);
  return saveThenRefresh(
    runTransaction(db, async (transaction) => {
      await transaction.get(ref);
      // Both dates come from the server's clock, not the phone's, which may be wrong.
      transaction.set(ref, { ...toDrinkData(drink), createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    })
  );
}

// `original` is the drink as it was when the form opened. If the server copy is different now, someone else changed
// it in the meantime, so nothing is saved and ConflictError is thrown.
export function updateDrink(id, drink, original) {
  const ref = doc(db, "drinks", id);
  return saveThenRefresh(
    runTransaction(db, async (transaction) => {
      const current = await transaction.get(ref);
      if (!current.exists()) throw new DeletedError();
      if (original && !sameRecipe(current.data(), original)) throw new ConflictError();
      transaction.update(ref, { ...toDrinkData(drink), updatedAt: serverTimestamp() });
    })
  );
}

export async function deleteDrink(id) {
  const ref = doc(db, "drinks", id);
  await withTimeout(
    runTransaction(db, async (transaction) => {
      const current = await transaction.get(ref);
      if (!current.exists()) return;
      transaction.delete(ref);
    })
  );
  // The drink is gone from the server, but a transaction doesn't change this phone's list, and when the list catches
  // up after a reconnect Firestore can be slow to report deletions. Deleting it again here, the ordinary way, removes
  // it from this phone's list and saved copy straight away. On the server it's already gone, so this changes nothing
  // there; drink IDs are random and never reused, so even a late retry can't remove anything else.
  deleteDoc(ref).catch((error) => console.error("Couldn't remove the deleted cocktail from this phone's list:", error));
}
