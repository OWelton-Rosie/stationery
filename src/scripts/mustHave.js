/**
 * A mapping of school year levels to their required (must-have) subjects.
 * This object is immutable.
 * @readonly
 */
const MUST_HAVE_SUBJECTS_BY_YEAR = Object.freeze({
  "9": Object.freeze([
    "English",
    "Mathematics",
    "Science",
    "Social Studies",
    "Te Ao Māori",
    "Health and Physical Education",
  ]),
  "10": Object.freeze([
    "English",
    "Mathematics",
    "Science",
    "Social Studies",
    "Health and Physical Education",
  ]),
  "11": Object.freeze(["English", "Mathematics"]),
  "12": Object.freeze(["English"]),
  "13": Object.freeze([]),
});

/**
 * Returns the required subjects for a given school year level.
 *
 * @param {string} year - The school year as a string (e.g., "9", "10", etc.).
 * @returns {string[]} - An array of required subject names, or an empty array if none.
 */
export function getMustHaveSubjects(year) {
  if (typeof year !== "string") {
    console.warn(`Invalid year type: expected string but received ${typeof year}`);
    return [];
  }

  return MUST_HAVE_SUBJECTS_BY_YEAR[year] || [];
}
