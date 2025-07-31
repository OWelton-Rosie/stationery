// Map of year levels to their required (must-have) subjects
const MUST_HAVE_SUBJECTS_BY_YEAR = {
  "9": [
    "English",
    "Mathematics",
    "Science",
    "Social Studies",
    "Te Ao Māori",
    "Health and Physical Education"
  ],
  "10": [
    "English",
    "Mathematics",
    "Science",
    "Social Studies",
    "Health and Physical Education"
  ],
  "11": ["English", "Mathematics"],
  "12": ["English"],
  "13": []
};

/**
 * Returns the required subjects for a given school year level.
 *
 * @param {string} year - The school year as a string (e.g. "9", "10", etc.).
 * @returns {string[]} - An array of required subject names.
 */
export function getMustHaveSubjects(year) {
  return MUST_HAVE_SUBJECTS_BY_YEAR[year] || [];
}
