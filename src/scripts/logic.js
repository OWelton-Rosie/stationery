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
const foreignLanguages = new Set(["Japanese", "Chinese", "Spanish"]);
let stationeryData = {};

// Utility Functions
function createSubjectCheckbox(subject, isMandatory) {
  const checkboxId = `subject-${subject.replace(/\s+/g, "-")}`;

  const wrapper = document.createElement("div");
  wrapper.className = "subject-checkbox";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = checkboxId;
  checkbox.name = "subject";
  checkbox.value = subject;
  if (isMandatory) {
    checkbox.checked = true;
    checkbox.disabled = true;
  }

  const label = document.createElement("label");
  label.htmlFor = checkboxId;

  const space = document.createTextNode(" ");
  const labelText = document.createTextNode(subject + (isMandatory ? " (Required)" : ""));

  label.appendChild(space);
  label.appendChild(labelText);

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);

  return wrapper;
}

function displayError(message) {
  resultDiv.innerHTML = "";
  const error = document.createElement("p");
  error.style.color = "red";
  error.textContent = message;
  resultDiv.appendChild(error);
}

function clearSubjectsAndResult() {
  subjectsDiv.innerHTML = "";
  resultDiv.innerHTML = "";
}

function enforceSelectionRules(year, mandatoryCount) {
  const checkboxes = subjectsDiv.querySelectorAll('input[name="subject"]');

  checkboxes.forEach(checkbox => {
    if (checkbox.disabled) return;

    checkbox.addEventListener("change", () => {
      resultDiv.innerHTML = "";

      const selected = [...checkboxes].filter(cb => cb.checked && !cb.disabled);
      const selectedValues = selected.map(cb => cb.value);
      const selectedLanguages = selectedValues.filter(sub => foreignLanguages.has(sub));

      if (selectedLanguages.length > 1) {
        checkbox.checked = false;
        displayError(ERRORS.tooManyLanguages);
        return;
      }

      if (year === "10") {
        const maxSelectable = selectedLanguages.length === 1 ? 3 : 4;
        if (selected.length > maxSelectable) {
          checkbox.checked = false;
          displayError(ERRORS.tooManySubjectsYr10);
        }
      } else {
        if (selected.length > (9 - mandatoryCount)) {
          checkbox.checked = false;
          displayError(ERRORS.tooManySubjects);
        }
      }
    });
  });
}

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
      const mustHave = getMustHaveSubjects(year);
      const isSenior = ["9", "10", "11", "12", "13"].includes(year);

      subjects.forEach(subject => {
        const isMandatory = isSenior && mustHave.includes(subject);
        const checkbox = createSubjectCheckbox(subject, isMandatory);
        subjectsDiv.appendChild(checkbox);
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

function renderResultList(html, text) {
  resultDiv.innerHTML = "";

  const container = document.createElement("div");
  container.className = "stationery-list-container";

  const heading = document.createElement("h2");
  heading.textContent = "Stationery List";

  const content = document.createElement("div");
  content.innerHTML = html;

  // Wrapper for button and copied status, laid out horizontally
  const copyWrapper = document.createElement("div");
  copyWrapper.style.display = "flex";
  copyWrapper.style.alignItems = "center";
  copyWrapper.style.gap = "1rem";
  copyWrapper.style.marginTop = "1rem";

  const copyBtn = document.createElement("button");
  copyBtn.id = "copy-btn";
  copyBtn.textContent = "Copy List";

  const status = document.createElement("span");
  status.id = "copy-status";
  status.style.color = "black";
  status.style.display = "none";
  status.textContent = "Copied to clipboard!";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  copyBtn.addEventListener("click", () => {
    copyToClipboard(text);
    status.style.display = "inline";
    setTimeout(() => (status.style.display = "none"), 2000);
  });

  copyWrapper.appendChild(copyBtn);
  copyWrapper.appendChild(status);

  container.append(heading, content, copyWrapper);
  resultDiv.appendChild(container);
}

function handleGenerateClick() {
  const year = yearSelect.value;
  const selectedSubjects = [...document.querySelectorAll('input[name="subject"]:checked')].map(cb => cb.value);

  const selectedLanguages = selectedSubjects.filter(sub => foreignLanguages.has(sub));
  const mandatoryCount = document.querySelectorAll('input[name="subject"][disabled]').length;
  const electiveCount = selectedSubjects.length - mandatoryCount;

  if (selectedSubjects.length === 0) {
    displayError(ERRORS.noSubjects);
    return;
  }

  if (selectedLanguages.length > 1) {
    displayError(ERRORS.tooManyLanguages);
    return;
  }

  if (year === "10") {
    const maxAllowed = selectedLanguages.length === 1 ? 3 : 4;
    if (electiveCount > maxAllowed) {
      displayError(ERRORS.tooManySubjectsYr10);
      return;
    }
  } else {
    if (electiveCount > 9 - mandatoryCount) {
      displayError(ERRORS.tooManySubjects);
      return;
    }
  }

  const categorizedItems = categorizeStationery(selectedSubjects, stationeryData);
  const { html: listHTML, text: listText } = buildCategorizedListOutput(categorizedItems);
  renderResultList(listHTML, listText);
}

// Event Listeners
yearSelect.addEventListener("change", handleYearChange);
generateBtn.addEventListener("click", handleGenerateClick);
