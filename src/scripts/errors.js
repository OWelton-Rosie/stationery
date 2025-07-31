/**
 * @typedef {Object.<string, string>} ErrorMessages
 * @description A frozen map of descriptive error identifiers to user-facing strings.
 */

/**
 * Application-wide user-facing error messages.
 * Use keys as identifiers in logic and display the corresponding values to users.
 * @type {Readonly<ErrorMessages>}
 */
export const ERRORS = Object.freeze({
  fetchFail: "Could not load stationery list. Please try again later while we resolve this issue.",
  noSubjects: "You must select at least one subject.",
  tooManyLanguages: "You may only select one language: Japanese, Chinese, or Spanish.",
  tooManySubjects: "You can select a maximum of 6 subjects.",
  tooManySubjectsYr10:
    "Year 10 students must take 5 required subjects, plus either 1 language and 2 more subjects, or 4 subjects if no language is chosen.",
});
