import { ERRORS } from './errors.js';
import { copyToClipboard } from './clipboard.js';

const yearSelect = document.getElementById("year");
const subjectsDiv = document.getElementById("subjects");
const subjectsSection = document.getElementById("subjects-section");
const generateBtn = document.getElementById("generate");
const resultDiv = document.getElementById("result");

let stationeryData = {};
const foreignLanguages = ["Japanese", "Chinese", "Spanish"];

yearSelect.addEventListener("change", () => {
  const year = yearSelect.value;
  subjectsDiv.innerHTML = "";
  resultDiv.innerHTML = "";
  stationeryData = {};

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
      const mustHave = ["English", "Mathematics", "Science", "Social Studies", "Māori", "Health and Physical Education"];
      const preselect = ["9", "10", "11"].includes(year);

      subjects.forEach(subject => {
        const isMandatory = preselect && mustHave.includes(subject);
        const checkboxId = `subject-${subject.replace(/\s+/g, "-")}`;

        const div = document.createElement("div");
        div.className = "subject-checkbox";
        div.innerHTML = `
          <input 
            type="checkbox" 
            id="${checkboxId}" 
            name="subject" 
            value="${subject}" 
            ${isMandatory ? "checked disabled" : ""}
          >
          <label for="${checkboxId}">${subject}${isMandatory ? " (Required)" : ""}</label>
        `;
        subjectsDiv.appendChild(div);
      });

      const mandatoryCount = subjectsDiv.querySelectorAll('input[disabled]').length;

      subjectsDiv.querySelectorAll('input[name="subject"]').forEach(checkbox => {
        if (!checkbox.disabled) {
          checkbox.addEventListener("change", () => {
            resultDiv.innerHTML = "";

            const selected = [...subjectsDiv.querySelectorAll('input[name="subject"]:checked:not([disabled])')];
            const selectedValues = selected.map(cb => cb.value);
            const selectedLanguages = selectedValues.filter(sub => foreignLanguages.includes(sub));

            if (selectedLanguages.length > 1) {
              checkbox.checked = false;
              resultDiv.innerHTML = `<p style="color:red;">${ERRORS.tooManyLanguages}</p>`;
              return;
            }

            if (year === "10") {
              const maxSelectable = selectedLanguages.length === 1 ? 3 : 4;
              if (selected.length > maxSelectable) {
                checkbox.checked = false;
                resultDiv.innerHTML = `<p style="color:red;">${ERRORS.tooManySubjectsYr10}</p>`;
              }
            } else {
              if (selected.length > 6 - mandatoryCount) {
                checkbox.checked = false;
                resultDiv.innerHTML = `<p style="color:red;">${ERRORS.tooManySubjects}</p>`;
              }
            }
          });
        }
      });

      subjectsSection.style.display = "block";
    })
    .catch(err => {
      resultDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
      subjectsSection.style.display = "none";
    });
});

generateBtn.addEventListener("click", () => {
  const selectedSubjects = [...document.querySelectorAll('input[name="subject"]:checked')]
    .map(cb => cb.value);

  const selectedLanguages = selectedSubjects.filter(subject => foreignLanguages.includes(subject));

  if (selectedSubjects.length === 0) {
    resultDiv.innerHTML = `<p>${ERRORS.noSubjects}</p>`;
    return;
  }

  if (selectedLanguages.length > 1) {
    resultDiv.innerHTML = `<p style="color:red;">${ERRORS.tooManyLanguages}</p>`;
    return;
  }

  if (yearSelect.value === "10") {
    const optionalCount = selectedSubjects.length - 6;
    const maxAllowed = selectedLanguages.length === 1 ? 3 : 4;
    if (optionalCount > maxAllowed) {
      resultDiv.innerHTML = `<p style="color:red;">${ERRORS.tooManySubjectsYr10}</p>`;
      return;
    }
  } else {
    if (selectedSubjects.length > 6) {
      resultDiv.innerHTML = `<p style="color:red;">${ERRORS.tooManySubjects}</p>`;
      return;
    }
  }

  const items = new Set();
  selectedSubjects.forEach(subject => {
    stationeryData[subject]?.forEach(item => items.add(item));
  });

  const itemList = [...items];
  const listHTML = itemList.map(i => `<li>${i}</li>`).join("");
  const listText = itemList.map(i => `- ${i}`).join("\n");

  resultDiv.innerHTML = `
    <h2>Stationery List</h2>
    <ul>${listHTML}</ul>
    <button id="copy-btn">Copy List</button>
    <p id="copy-status" style="color: black; display: none;">Copied to clipboard!</p>
  `;

  document.getElementById("copy-btn").addEventListener("click", () => {
    copyToClipboard(listText);
  });
});
