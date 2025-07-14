import { ERRORS } from './errors.js';
import { copyToClipboard } from './clipboard.js';

const yearSelect = document.getElementById("year");
const subjectsDiv = document.getElementById("subjects");
const subjectsSection = document.getElementById("subjects-section");
const generateBtn = document.getElementById("generate");
const resultDiv = document.getElementById("result");

let stationeryData = {};

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
      subjects.forEach(subject => {
        const div = document.createElement("div");
        div.className = "subject-checkbox";
        div.innerHTML = `
          <input type="checkbox" id="${subject}" name="subject" value="${subject}">
          <label for="${subject}">${subject}</label>
        `;
        subjectsDiv.appendChild(div);
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

  if (selectedSubjects.length === 0) {
    resultDiv.innerHTML = `<p>${ERRORS.noSubjects}</p>`;
    return;
  }

  const foreignLanguages = ["Japanese", "Chinese", "Spanish"];
  const selectedLanguages = selectedSubjects.filter(subject => foreignLanguages.includes(subject));

  if (selectedLanguages.length > 1) {
    resultDiv.innerHTML = `<p style="color:red;">${ERRORS.tooManyLanguages}</p>`;
    return;
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
