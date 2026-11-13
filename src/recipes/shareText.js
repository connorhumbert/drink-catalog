import { garnishText, isGarnish, isNoteLine, noteLineText } from "./ingredients";

// The message sent when someone shares a drink: the whole recipe as plain text, so a friend can read it without the
// app, followed by a link that opens the drink in the app.
//
// Gold Rush
// • 2 oz bourbon
// • 3/4 oz honey syrup
// Garnish: Lemon twist
// Serve in: Rocks
//
// Notes:
// • Shake with ice and strain
export function drinkShareText(record) {
  const ingredients = record.ingredients || [];
  const lines = [record.name];

  ingredients.filter((item) => !isGarnish(item) && !isNoteLine(item)).forEach((item) => lines.push(`• ${item.trim()}`));
  const garnish = ingredients.filter(isGarnish).map(garnishText).filter(Boolean).join(", ");
  if (garnish) lines.push(`Garnish: ${garnish}`);
  if (record.glass) lines.push(`Serve in: ${record.glass}`);

  const notes = ingredients.filter(isNoteLine).map(noteLineText).filter(Boolean);
  if (notes.length > 0) {
    lines.push("", "Notes:");
    notes.forEach((note) => lines.push(`• ${note.charAt(0).toUpperCase()}${note.slice(1)}`));
  }
  return lines.join("\n");
}

// The link that opens one drink in the app. Shared links use this address, so keep the /drink/:id route working.
export function drinkUrl(id, origin = window.location.origin) {
  return `${origin}/drink/${encodeURIComponent(id)}`;
}
