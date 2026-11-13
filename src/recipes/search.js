import Fuse from "fuse.js";
import { ingredientName, isGarnish, isNote, noteLineText, normalize } from "./ingredients";
import { alsoFinds, isSynonymName, wholeWord } from "./synonyms";

// Words in the search box, in the order they're shown:
// 1. Drinks whose name, ingredients or spirit closely match. Small typos are allowed ("margerita", "mohito").
// 2. If the whole search is a name with synonyms ("club soda"), drinks that use another name for it ("soda water").
// 3. Drinks whose notes contain every word typed, as whole words ("olive" finds "Dirty: 1/2 oz olive brine").
//    Notes are matched exactly, so "Aviation" doesn't pick up a note about "variations".
export function searchByText(records, text) {
  const query = normalize(text);
  if (!query) return records;

  const fuse = new Fuse(
    records.map((record) => ({
      record,
      name: normalize(record.name),
      booze: normalize(record.booze || ""),
      ingredients: (record.ingredients || [])
        .filter((item) => !isGarnish(item) && !isNote(item))
        .map((item) => normalize(ingredientName(item))),
    })),
    {
      keys: [
        { name: "name", weight: 0.6 },
        { name: "ingredients", weight: 0.3 },
        { name: "booze", weight: 0.1 },
      ],
      // 0.2 still finds most one-letter typos ("margerita", "mohito") but stops near-misses like
      // "Orange Julius" matching every drink with orange juice. 0.15 and below start missing real typos.
      threshold: 0.2,
      ignoreLocation: true,
      minMatchCharLength: 2,
    }
  );
  const results = fuse.search(query).map((hit) => hit.item.record);
  const shown = new Set(results);
  const add = (record) => {
    if (!shown.has(record)) {
      shown.add(record);
      results.push(record);
    }
  };

  // Only the other names, as whole words: the name itself was already searched above, and matching it again by the
  // start of a word would make "gin" find every drink with ginger beer.
  if (isSynonymName(query)) {
    const others = alsoFinds(query).map(wholeWord);
    records.filter((record) => ingredientNamesOf(record).some((name) => others.some((pattern) => pattern.test(name)))).forEach(add);
  }

  const words = query.split(" ").filter((word) => word.length >= 2);
  if (query.length >= 3 && words.length > 0) {
    const patterns = words.map(wholeWord);
    records
      .filter((record) =>
        notesOf(record).some((note) => patterns.every((pattern) => pattern.test(note)))
      )
      .forEach(add);
  }

  return results;
}

// A drink's ingredient names, without garnish or notes, normalized for matching ("2 oz Tito's" -> "tito's").
function ingredientNamesOf(record) {
  return (record.ingredients || [])
    .filter((item) => !isGarnish(item) && !isNote(item))
    .map((item) => normalize(ingredientName(item)));
}

// A drink's note lines ("Note: …", older "Steps: …", "Dirty: 1/2 oz olive brine"), normalized for matching.
function notesOf(record) {
  return (record.ingredients || [])
    .filter((item) => !isGarnish(item) && isNote(item))
    .map((item) => normalize(noteLineText(item)));
}
