import { drinkShareText, drinkUrl } from "../recipes/shareText";

// Opens the phone's share sheet (Messages, WhatsApp, email…) with the recipe and a link to it. Computers without a
// share sheet copy the same text to the clipboard instead. Returns what happened:
// "shared", "cancelled" (the person closed the share sheet), "copied" or "unavailable".
export async function shareDrink(record, nav = navigator) {
  const text = drinkShareText(record);
  const url = drinkUrl(record._id);

  if (typeof nav.share === "function") {
    try {
      await nav.share({ title: record.name, text, url });
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") return "cancelled";
      // Some browsers refuse a share they don't like; fall through to the clipboard.
    }
  }
  if (typeof nav.clipboard?.writeText === "function") {
    try {
      await nav.clipboard.writeText(`${text}\n\n${url}`);
      return "copied";
    } catch (error) {
      return "unavailable";
    }
  }
  return "unavailable";
}
