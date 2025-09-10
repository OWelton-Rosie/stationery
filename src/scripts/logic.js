// logic.js
import { ERRORS } from './errors.js';
import { categorizeStationery, buildCategorizedListOutput } from './categorisation.js';
import { renderResultList, displayError } from './dom.js';
import { handleYearChange } from './year.js';

// DOM
const yearSelect = document.getElementById("year");
const subjectsDiv = document.getElementById("subjects");
const subjectsSection = document.getElementById("subjects-section");
const generateBtn = document.getElementById("generate");
const resultDiv = document.getElementById("result");

let stationeryData = {};
const FOREIGN_LANGUAGES = new Set(["Japanese", "Chinese", "Spanish"]);

function setStationeryData(data) {
  stationeryData = data;
}

function handleGenerateClick() {
  const year = yearSelect.value;
  const selectedSubjects = [...document.querySelectorAll('input[name="subject"]:checked')].map(cb => cb.value);

  if (selectedSubjects.length === 0) {
    displayError(resultDiv, ERRORS.noSubjects);
    return;
  }

  const mandatorySubjects = [...document.querySelectorAll('input[name="subject"][disabled]')].map(cb => cb.value);
  const electiveSubjects = selectedSubjects.filter(s => !mandatorySubjects.includes(s));
  const selectedLanguages = electiveSubjects.filter(s => FOREIGN_LANGUAGES.has(s));

  if (year === "10") {
    const valid =
      (selectedLanguages.length === 1 && electiveSubjects.length === 3) ||
      (selectedLanguages.length === 0 && electiveSubjects.length === 4);

    if (!valid || selectedLanguages.length > 1) {
      displayError(resultDiv, ERRORS.tooManySubjectsYr10);
      return;
    }
  } else {
    if (selectedLanguages.length > 1) {
      displayError(resultDiv, ERRORS.tooManyLanguages);
      return;
    }

    if (electiveSubjects.length > (9 - mandatorySubjects.length)) {
      displayError(resultDiv, ERRORS.tooManySubjects);
      return;
    }
  }

  const categorized = categorizeStationery(selectedSubjects, stationeryData);
  const { html, text } = buildCategorizedListOutput(categorized);
  renderResultList(resultDiv, html, text);
}

// Attach listeners
yearSelect.addEventListener("change", () => handleYearChange(yearSelect, subjectsDiv, subjectsSection, resultDiv, setStationeryData));
generateBtn.addEventListener("click", handleGenerateClick);
