// year.js
import { ERRORS } from './errors.js';
import { getMustHaveSubjects } from './mustHave.js';
import { createSubjectCheckbox, clearSubjectsAndResult } from './dom.js';
import { enforceSelectionRules } from './rules.js';

/**
 * Handles year change: fetches subject JSON and renders checkboxes.
 */
export async function handleYearChange(yearSelect, subjectsDiv, subjectsSection, resultDiv, setStationeryData) {
  const year = yearSelect.value;
  clearSubjectsAndResult(subjectsDiv, resultDiv);

  if (!year) {
    subjectsSection.style.display = "none";
    return;
  }

  try {
    const res = await fetch(`./jsons/year${year}.json`);
    if (!res.ok) throw new Error(ERRORS.fetchFail);
    const data = await res.json();
    setStationeryData(data);

    const subjects = Object.keys(data);
    const mustHaveSubjects = getMustHaveSubjects(year);
    const isSenior = ["9", "10", "11", "12", "13"].includes(year);

    subjects.forEach(subject => {
      const isMandatory = isSenior && mustHaveSubjects.includes(subject);
      subjectsDiv.appendChild(createSubjectCheckbox(subject, isMandatory));
    });

    const mandatoryCount = subjectsDiv.querySelectorAll('input[disabled]').length;
    enforceSelectionRules(year, mandatoryCount, subjectsDiv, resultDiv);

    subjectsSection.style.display = "block";
  } catch (err) {
    resultDiv.innerHTML = "";
    subjectsSection.style.display = "none";
    resultDiv.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}
