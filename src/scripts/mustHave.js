/**
 * A mapping of school year levels to their required (must-have) subjects.
 * These subjects are compulsory for each year and will always be pre-selected
 * and disabled in the subject list.
 *
 * Notes:
 * - Year 10 students still have 5 mandatory subjects, but their electives
 *   are capped differently:
 *     • 4 electives total if no foreign language is chosen
 *     • 2 electives total if exactly 1 foreign language is chosen
 *     • never more than 1 language
 *
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
  "11": Object.freeze([
    "English",
    "Mathematics",
  ]),
  "12": Object.freeze([
    "English",
  ]),
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
    console.warn(
      `Invalid year type passed to getMustHaveSubjects: expected string but received ${typeof year}`
    );
    return [];
  }

  return MUST_HAVE_SUBJECTS_BY_YEAR[year] || [];
}
