// Helpers for saving drinks. Saving needs a connection: changes are never queued on the device to be sent later,
// because a late save can overwrite something newer that someone else saved in the meantime.

export class ConflictError extends Error {
  constructor() {
    super("The cocktail changed on the server since the form was opened.");
    this.name = "ConflictError";
  }
}

export class DeletedError extends Error {
  constructor() {
    super("The cocktail no longer exists.");
    this.name = "DeletedError";
  }
}

export class TimeoutError extends Error {
  constructor() {
    super("The server didn't answer in time.");
    this.name = "TimeoutError";
  }
}

// Rejects with TimeoutError if `promise` takes longer than `ms`, so a dead connection doesn't spin forever.
export function withTimeout(promise, ms = 15000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError()), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// What gets saved for a drink. The Firestore rules (set in the Firebase console) only allow these fields.
// Firestore sorts strings case-sensitively, so store a lowercase copy of the name to keep alphabetical order.
export function toDrinkData({ name, ingredients, booze, glass }) {
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

// The parts of a drink someone edits in the form. Other fields (timestamps, old like counts) don't count.
function recipeOf(drink) {
  return {
    name: drink?.name || "",
    booze: drink?.booze || "",
    ingredients: Array.isArray(drink?.ingredients) ? drink.ingredients : [],
    glass: drink?.glass || "",
  };
}

// Is the recipe the same? Used to check nobody else changed a drink while it was being edited.
export function sameRecipe(a, b) {
  return JSON.stringify(recipeOf(a)) === JSON.stringify(recipeOf(b));
}

const NO_CONNECTION = new Set(["unavailable", "deadline-exceeded", "failed-precondition"]);

function isConnectionError(error) {
  return error instanceof TimeoutError || NO_CONNECTION.has(error?.code) || /offline|network/i.test(error?.message || "");
}

// Plain-language message for a failed save.
export function saveErrorMessage(error) {
  if (error instanceof ConflictError) {
    return "Someone else changed this cocktail while you were editing, so your changes weren't saved. Go back and open it again to see their version.";
  }
  if (error instanceof DeletedError) {
    return "This cocktail was deleted by someone else.";
  }
  if (isConnectionError(error)) {
    return "Couldn't save: no internet connection. Check your connection and try again. Your changes are still here.";
  }
  return "Couldn't save. Please try again.";
}

// Plain-language message for a failed delete.
export function deleteErrorMessage(error) {
  if (isConnectionError(error)) return "Couldn't delete: no internet connection. Try again when you're connected.";
  return "Couldn't delete the cocktail. Please try again.";
}
