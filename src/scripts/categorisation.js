// Categorization mapping for each stationery item
const ITEM_CATEGORIES = {
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
  "Water bottle": "Miscellaneous"
};

/**
 * Groups stationery items into categories based on the ITEM_CATEGORIES map.
 *
 * @param {string[]} selectedSubjects - Subjects selected by the user.
 * @param {Object} stationeryData - Full stationery list mapped by subject.
 * @returns {Object} - Categorized items with quantities.
 */
export function categorizeStationery(selectedSubjects, stationeryData) {
  const categorizedItems = {};

  for (const subject of selectedSubjects) {
    const items = stationeryData[subject] || [];

    for (const item of items) {
      const category = ITEM_CATEGORIES[item] || "Uncategorized";

      if (!categorizedItems[category]) {
        categorizedItems[category] = {};
      }

      categorizedItems[category][item] = (categorizedItems[category][item] || 0) + 1;
    }
  }

  return categorizedItems;
}

/**
 * Builds both HTML and plain text representations of categorized stationery.
 *
 * @param {Object} categorizedItems - Items grouped by category and counted.
 * @returns {{ html: string, text: string }} - HTML and plain text output.
 */
export function buildCategorizedListOutput(categorizedItems) {
  let html = "";
  let text = "";

  for (const [category, items] of Object.entries(categorizedItems)) {
    html += `<h3>${category}</h3><ul>`;
    text += `${category}:\n`;

    for (const [item, count] of Object.entries(items)) {
      const itemText = count > 1 ? `${item} x${count}` : item;
      html += `<li>${itemText}</li>`;
      text += `- ${itemText}\n`;
    }

    html += `</ul>`;
    text += `\n`;
  }

  return { html, text };
}
