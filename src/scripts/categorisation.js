/**
 * Mapping of stationery items to their categories.
 * This object and its contents are immutable.
 * @readonly
 */
const ITEM_CATEGORIES = Object.freeze({
  "1J5 Quad exercise book x2": "Paper Products",
  "2B8 exercise book": "Paper Products",
  "1B8 exercise book": "Paper Products",
  "Casio fx82 calculator": "Electronics",
  "Laptop": "Electronics",
  "Headphones": "Electronics",
  "Ruler": "Tools",
  "Protractor": "Tools",
  "Eraser": "Tools",
  "Scissors": "Tools",
  "Black pen": "Writing Tools",
  "Red pen": "Writing Tools",
  "Blue pen": "Writing Tools",
  "Pencil": "Writing Tools",
  "HB Pencil": "Writing Tools",
  "Highlighter x4": "Writing Tools",
  "Whiteboard marker x4": "Writing Tools",
  "Glue stick": "Art Supplies",
  "Coloured pencils": "Art Supplies",
  "Water bottle": "Miscellaneous",
});

/**
 * Escapes HTML special characters in a string to prevent injection.
 * @param {string} unsafe - The unsafe string.
 * @returns {string} - The escaped string.
 */
function escapeHtml(unsafe) {
  return unsafe.replace(/[&<>"']/g, (match) => {
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return escapeMap[match];
  });
}

/**
 * Categorizes stationery items by their category and counts quantities.
 *
 * @param {string[]} selectedSubjects - Array of selected subject names.
 * @param {Record<string, string[]>} stationeryData - Map of subject to item arrays.
 * @returns {Record<string, Record<string, number>>} - Categorized items with counts.
 */
export function categorizeStationery(selectedSubjects, stationeryData) {
  /** @type {Record<string, Record<string, number>>} */
  const categorizedItems = {};

  for (const subject of selectedSubjects) {
    const items = stationeryData[subject] ?? [];

    for (const item of items) {
      const category = ITEM_CATEGORIES[item] ?? "Uncategorised";

      if (!categorizedItems[category]) {
        categorizedItems[category] = {};
      }

      categorizedItems[category][item] = (categorizedItems[category][item] ?? 0) + 1;
    }
  }

  return categorizedItems;
}

/**
 * Builds HTML and plain text outputs for categorized stationery items.
 *
 * @param {Record<string, Record<string, number>>} categorizedItems - Categorized items with counts.
 * @returns {{ html: string, text: string }} - HTML and plain text representations.
 */
export function buildCategorizedListOutput(categorizedItems) {
  let html = "";
  let text = "";

  for (const [category, items] of Object.entries(categorizedItems)) {
    const escapedCategory = escapeHtml(category);
    html += `<h3>${escapedCategory}</h3><ul>`;
    text += `${category}:\n`;

    for (const [item, count] of Object.entries(items)) {
      const itemText = count > 1 ? `${item} x${count}` : item;
      html += `<li>${escapeHtml(itemText)}</li>`;
      text += `- ${itemText}\n`;
    }

    html += "</ul>";
    text += "\n";
  }

  return { html, text };
}
