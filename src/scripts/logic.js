// Imports
import { ERRORS } from './errors.js';
import { copyToClipboard } from './clipboard.js';
import { categorizeStationery, buildCategorizedListOutput } from './categorisation.js';
import { getMustHaveSubjects } from './mustHave.js';

// DOM Elements
const yearSelect = document.getElementById("year");
const subjectsDiv = document.getElementById("subjects");
const subjectsSection = document.getElementById("subjects-section");
const generateBtn = document.getElementById("generate");
const resultDiv = document.getElementById("result");

// Constants
const FOREIGN_LANGUAGES = new Set(["Japanese", "Chinese", "Spanish"]);
let stationeryData = {};

/**
 * Creates a checkbox element with label for a subject.
 * @param {string} subject
 * @param {boolean} isMandatory
 * @returns {HTMLElement}
 */
function createSubjectCheckbox(subject, isMandatory) {
  const checkboxId = `subject-${subject.replace(/\s+/g, "-")}`;

  const wrapper = document.createElement("div");
  wrapper.className = "subject-checkbox";

  const checkbox = Object.assign(document.createElement("input"), {
    type: "checkbox",
    id: checkboxId,
    name: "subject",
    value: subject,
    checked: isMandatory,
    disabled: isMandatory,
  });

  const label = Object.assign(document.createElement("label"), {
    htmlFor: checkboxId,
    textContent: `${subject}${isMandatory ? " (Required)" : ""}`,
  });

  wrapper.append(checkbox, label);
  return wrapper;
}

/**
 * Displays an error message in the resultDiv.
 * @param {string} message
 */
function displayError(message) {
  resultDiv.innerHTML = "";
  const error = document.createElement("p");
  error.style.color = "red";
  error.textContent = message;
  resultDiv.appendChild(error);
}

/**
 * Clears subjects list and result content.
 */
function clearSubjectsAndResult() {
  subjectsDiv.innerHTML = "";
  resultDiv.innerHTML = "";
}

/**
 * Enforces selection rules and live error messages for all years.
 * @param {string} year
 * @param {number} mandatoryCount
 */
function enforceSelectionRules(year, mandatoryCount) {
  const checkboxes = subjectsDiv.querySelectorAll('input[name="subject"]');

  checkboxes.forEach(checkbox => {
    if (checkbox.disabled) return;

    checkbox.addEventListener("change", () => {
      const selected = [...checkboxes].filter(cb => cb.checked && !cb.disabled);
      const electiveSubjects = selected.map(cb => cb.value);
      const selectedLanguages = electiveSubjects.filter(sub => FOREIGN_LANGUAGES.has(sub));
      const electiveCount = electiveSubjects.length;

      // Year 10 live warning (do not uncheck)
      if (year === "10") {
        if (
          (selectedLanguages.length === 1 && electiveCount > 2) ||
          (selectedLanguages.length === 0 && electiveCount > 4) ||
          selectedLanguages.length > 1
        ) {
          displayError(ERRORS.tooManySubjectsYr10);
        } else {
          resultDiv.innerHTML = ""; // clear error if valid
        }
        return;
      }

      // Other years: live enforcement
      if (selectedLanguages.length > 1) {
        checkbox.checked = false;
        displayError(ERRORS.tooManyLanguages);
        return;
      }

      if (electiveCount > (9 - mandatoryCount)) {
        checkbox.checked = false;
        displayError(ERRORS.tooManySubjects);
        return;
      }

      // Clear error if selection is valid
      resultDiv.innerHTML = "";
    });
  });
}

/**
 * Handles year selection changes.
 */
function handleYearChange() {
  const year = yearSelect.value;
  clearSubjectsAndResult();

  if (!year) {
    subjectsSection.style.display = "none";
    return;
  }

  fetch(`./jsons/year${year}.json`)
    .then(res => {
      if (!res.ok) throw new Error(ERRORS.fetchFail);
      return res.json();
    })
    .then(data => {
      stationeryData = data;
      const subjects = Object.keys(data);
      const mustHaveSubjects = getMustHaveSubjects(year);
      const isSenior = ["9", "10", "11", "12", "13"].includes(year);

      subjects.forEach(subject => {
        const isMandatory = isSenior && mustHaveSubjects.includes(subject);
        subjectsDiv.appendChild(createSubjectCheckbox(subject, isMandatory));
      });

      const mandatoryCount = subjectsDiv.querySelectorAll('input[disabled]').length;
      enforceSelectionRules(year, mandatoryCount);

      subjectsSection.style.display = "block";
    })
    .catch(err => {
      displayError(err.message);
      subjectsSection.style.display = "none";
    });
}

/**
 * Renders stationery list HTML and a separate copy button outside the list container.
 * @param {string} html - The HTML string of the stationery list.
 * @param {string} text - The plain text of the stationery list for copying.
 */
function renderResultList(html, text) {
  resultDiv.innerHTML = "";

  const container = document.createElement("div");
  container.className = "stationery-list-container";

  const heading = document.createElement("h2");
  heading.textContent = "Stationery List";

  const content = document.createElement("div");
  content.innerHTML = html;

  container.append(heading, content);

  const copyWrapper = document.createElement("div");
  copyWrapper.style.display = "flex";
  copyWrapper.style.alignItems = "center";
  copyWrapper.style.gap = "1rem";
  copyWrapper.style.marginTop = "1rem";

  const copyBtn = Object.assign(document.createElement("button"), {
    id: "copy-btn",
    textContent: "Copy List",
  });

  const status = Object.assign(document.createElement("span"), {
    id: "copy-status",
    style: "color: black; display: none;",
    textContent: "Copied to clipboard!",
  });
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  copyBtn.addEventListener("click", () => {
    copyToClipboard(text);
    status.style.display = "inline";
    setTimeout(() => {
      status.style.display = "none";
    }, 2000);
  });

  copyWrapper.append(copyBtn, status);
  resultDiv.append(container, copyWrapper);
}

/**
 * Handles the "Generate" button click event.
 */
function handleGenerateClick() {
  const year = yearSelect.value;
  const checkboxes = document.querySelectorAll('input[name="subject"]:checked');
  const selectedSubjects = [...checkboxes].map(cb => cb.value);

  if (selectedSubjects.length === 0) {
    displayError(ERRORS.noSubjects);
    return;
  }

  const mandatorySubjects = [...document.querySelectorAll('input[name="subject"][disabled]')].map(cb => cb.value);
  const electiveSubjects = selectedSubjects.filter(subject => !mandatorySubjects.includes(subject));
  const selectedLanguages = electiveSubjects.filter(subject => FOREIGN_LANGUAGES.has(subject));

  if (year === "10") {
    const valid =
      (selectedLanguages.length === 1 && electiveSubjects.length === 2) ||
      (selectedLanguages.length === 0 && electiveSubjects.length === 4);

    if (!valid || selectedLanguages.length > 1) {
      displayError(ERRORS.tooManySubjectsYr10);
      return;
    }
  } else {
    if (selectedLanguages.length > 1) {
      displayError(ERRORS.tooManyLanguages);
      return;
    }

    if (electiveSubjects.length > (9 - mandatorySubjects.length)) {
      displayError(ERRORS.tooManySubjects);
      return;
    }
  }

  const categorized = categorizeStationery(selectedSubjects, stationeryData);
  const { html, text } = buildCategorizedListOutput(categorized);
  renderResultList(html, text);
}

// Attach event listeners
yearSelect.addEventListener("change", handleYearChange);
generateBtn.addEventListener("click", handleGenerateClick);
