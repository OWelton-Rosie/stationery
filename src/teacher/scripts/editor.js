import { displayBullets, parseBulletsToJSON } from "./ui.js";

export function setupEditor(teacherSubjects, subjectMap) {
  const yearSelect = document.getElementById("edit-year");
  const stationeryDiv = document.getElementById("stationery-input");
  const statusEl = document.getElementById("save-status");
  let stationeryData = {};

  async function loadYear(year) {
    const url = `https://stationery.oweltonrosie.com/jsons/year${year}.json`;
    statusEl.textContent = `Loading Year ${year} data...`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          stationeryDiv.innerHTML = "";
          statusEl.textContent = `No data available for Year ${year}.`;
          return;
        }
        throw new Error(`Failed to fetch ${url} (status ${res.status})`);
      }

      const data = await res.json();
      stationeryData = data;

      const filtered = {};
      teacherSubjects.forEach(tsub => {
        const key = subjectMap[tsub];
        if (key && stationeryData[key]) filtered[key] = stationeryData[key];
      });

      stationeryDiv.innerHTML = displayBullets(filtered);
      statusEl.textContent = `Successfully loaded Year ${year} data.`;

    } catch (err) {
      console.error(err);
      stationeryDiv.innerHTML = "";
      statusEl.textContent = "Error loading JSON. Check console.";
    }
  }

  document.getElementById("save-stationery").addEventListener("click", () => {
    try {
      const updated = parseBulletsToJSON(stationeryDiv);
      teacherSubjects.forEach(tsub => {
        const key = subjectMap[tsub];
        if (key && updated[key]) stationeryData[key] = updated[key];
      });

      document.getElementById("formspree-subject").value = teacherSubjects.join(", ");
      document.getElementById("formspree-year").value = yearSelect.value;
      document.getElementById("formspree-stationery").value = JSON.stringify(updated, null, 2);

      document.getElementById("formspree-form").submit();
      statusEl.textContent = "Changes sent for review. It might take a while to process.";

    } catch (e) {
      console.error(e);
      statusEl.textContent = "Error preparing data for submission!";
    }
  });

  yearSelect.addEventListener("change", () => loadYear(yearSelect.value));
  loadYear(yearSelect.value);
}
