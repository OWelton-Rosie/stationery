// -----------------------------
// Run after DOM is fully loaded
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // Teacher subjects & user setup
  // -----------------------------
  const teacherSubjects = JSON.parse(localStorage.getItem("teacherSubjects") || '["Maths","Sci","Eng"]');
  const username = localStorage.getItem("username"); // full name

  if (!username) {
    // Redirect to login if not logged in
    window.location.href = "login.html";
    return;
  }

  if (!teacherSubjects.length) {
    document.body.innerHTML = "<h2>Access Denied</h2><p>No subjects assigned.</p>";
    throw new Error("No teacher subjects found.");
  }

  // -----------------------------
  // DOM elements
  // -----------------------------
  const yearSelect = document.getElementById("edit-year");
  const stationeryDiv = document.getElementById("stationery-input");
  const statusEl = document.getElementById("save-status");

  // Create a “logged in as” element
  const loggedInEl = document.createElement("p");
  loggedInEl.id = "logged-in-user";
  loggedInEl.style.fontStyle = "inherit";
  loggedInEl.style.color = "black";
  loggedInEl.style.marginTop = "2.5rem";
  loggedInEl.style.marginBottom = "1rem";
  loggedInEl.textContent = `Logged in as ${username}`;

  // Insert below the header
  const header = document.querySelector("h1");
  if (header) {
    header.insertAdjacentElement("afterend", loggedInEl);
  } else {
    document.body.insertBefore(loggedInEl, document.body.firstChild);
  }

  // -----------------------------
  // Mapping short names to JSON keys
  // -----------------------------
  const subjectMap = {
    "Maths": "Mathematics",
    "Sci": "Science",
    "Eng": "English"
  };

  // -----------------------------
  // Data storage
  // -----------------------------
  let stationeryData = {};

  // -----------------------------
  // Convert data to bulleted list HTML
  // -----------------------------
  function displayBullets(data) {
    let html = "";
    for (const subject in data) {
      html += `<strong>${subject}:</strong><ul>`;
      data[subject].forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += "</ul>";
    }
    return html;
  }

  // -----------------------------
  // Parse editable bullets back to JSON
  // -----------------------------
  function parseBulletsToJSON(div) {
    const result = {};
    div.querySelectorAll("strong").forEach(header => {
      const subject = header.textContent.replace(":", "").trim();
      const items = [];
      let sibling = header.nextElementSibling;
      if (sibling && sibling.tagName === "UL") {
        sibling.querySelectorAll("li").forEach(li => items.push(li.textContent.trim()));
      }
      result[subject] = items;
    });
    return result;
  }

  // -----------------------------
  // Load JSON for a given year
  // -----------------------------
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

      // Filter only teacher subjects
      const filtered = {};
      teacherSubjects.forEach(tsub => {
        const key = subjectMap[tsub];
        if (key && stationeryData[key]) {
          filtered[key] = stationeryData[key];
        } else {
          console.warn(`Subject not found in JSON: ${tsub} -> ${key}`);
        }
      });

      // Display as editable bullets
      stationeryDiv.innerHTML = displayBullets(filtered);
      statusEl.textContent = `Successfully loaded Year ${year} data.`;

    } catch (err) {
      console.error(err);
      stationeryDiv.innerHTML = "";
      statusEl.textContent = "Error loading JSON. Check console.";
    }
  }

  // -----------------------------
  // Save changes
  // -----------------------------
  document.getElementById("save-stationery").addEventListener("click", () => {
    try {
      // Convert displayed bullets back to JSON
      const updated = parseBulletsToJSON(stationeryDiv);

      // Update full data for teacher subjects
      teacherSubjects.forEach(tsub => {
        const key = subjectMap[tsub];
        if (key && updated[key]) {
          stationeryData[key] = updated[key];
        }
      });

      console.log(`Updated data for Year ${yearSelect.value}:`, updated);

      // Formspree integration
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

  // -----------------------------
  // Reload when year changes
  // -----------------------------
  yearSelect.addEventListener("change", () => loadYear(yearSelect.value));

  // -----------------------------
  // Load default year on page load
  // -----------------------------
  loadYear(yearSelect.value);

});
