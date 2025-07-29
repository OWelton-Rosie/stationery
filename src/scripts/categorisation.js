// Map each stationery item string to a category
const itemCategories = {
    "1J5 Quad exercise book x2": "Paper Products",
    "Casio fx82 calculator": "Electronics",
    "Ruler": "Tools",
    "Black pen": "Writing Tools",
    "Red pen": "Writing Tools",
    "Blue pen": "Writing Tools",
    "HB Pencil": "Writing Tools",
    "Eraser": "Tools",
    "Protractor": "Tools",
    "Laptop": "Electronics",
    "Headphones": "Electronics",
    "2B8 exercise book": "Paper Products",
    "Glue stick": "Art Supplies",
    "Coloured pencils": "Art Supplies",
    "Highlighter x4": "Writing Tools",
    "1B8 exercise book": "Paper Products",
    "Scissors": "Tools",
    "Whiteboard marker x4": "Writing Tools",
    "Water bottle": "Miscellaneous",
    "Pencil": "Writing Tools"
    // Add any missing items here
  };
  
  /**
   * Categorize items using the itemCategories mapping
   */
  export function categorizeStationery(selectedSubjects, stationeryData) {
    const categorizedItems = {};
  
    selectedSubjects.forEach(subject => {
      stationeryData[subject]?.forEach(item => {
        const category = itemCategories[item] || "Uncategorized";
        if (!categorizedItems[category]) {
          categorizedItems[category] = {};
        }
        categorizedItems[category][item] = (categorizedItems[category][item] || 0) + 1;
      });
    });
  
    return categorizedItems;
  }
  
  export function buildCategorizedListOutput(categorizedItems) {
    let listHTML = "";
    let listText = "";
  
    for (const [category, items] of Object.entries(categorizedItems)) {
      listHTML += `<h3>${category}</h3><ul>`;
      listText += `${category}:\n`;
  
      for (const [item, count] of Object.entries(items)) {
        listHTML += `<li>${item}${count > 1 ? ` x${count}` : ""}</li>`;
        listText += `- ${item}${count > 1 ? ` x${count}` : ""}\n`;
      }
      listHTML += `</ul>`;
      listText += `\n`;
    }
  
    return { html: listHTML, text: listText };
  }
  