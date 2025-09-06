
  // Teacher subjects (example; must match your login system)
  const teacherSubjects = JSON.parse(localStorage.getItem("teacherSubjects") || '["Maths","Sci","Eng"]');
  
  if (!teacherSubjects.length) {
    document.body.innerHTML = "<h2>Access Denied</h2><p>No subjects assigned.</p>";
    throw new Error("No teacher subjects found.");
  }
  
  const yearSelect = document.getElementById("edit-year");
  const textarea = document.getElementById("stationery-input");
  let stationeryData = {};
  
  function loadYear(year) {
    const url = `https://stationery.oweltonrosie.com/jsons/year${year}.json`;
  
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${url}`);
        return res.json();
      })
      .then(data => {
        stationeryData = data;
  
        // Build filtered object using mapping
        const filtered = {};
        teacherSubjects.forEach(tsub => {
          const key = subjectMap[tsub];
          if (key && stationeryData[key]) {
            filtered[key] = stationeryData[key];
          } else {
            console.warn(`Subject not found in JSON: ${tsub} -> ${key}`);
          }
        });
  
        // Pretty-print JSON
        textarea.value = JSON.stringify(filtered, null, 2);
        document.getElementById("save-status").textContent = `Successfully loaded Year ${year} data.`;
      })
      .catch(err => {
        console.error(err);
        textarea.value = "";
        document.getElementById("save-status").textContent = "Error loading JSON.";
      });
  }
  
  document.getElementById("save-stationery").addEventListener("click", () => {
    try {
      const updated = JSON.parse(textarea.value);
  
      // Update only teacher's subjects
      teacherSubjects.forEach(tsub => {
        const key = subjectMap[tsub];
        if (key && updated[key]) {
          stationeryData[key] = updated[key];
        }
      });
  
      console.log(`Updated data for Year ${yearSelect.value}:`, stationeryData);
  
      // --- Formspree integration ---
      document.getElementById("formspree-subject").value = teacherSubjects.join(", ");
      document.getElementById("formspree-year").value = yearSelect.value;
      document.getElementById("formspree-stationery").value = JSON.stringify(updated, null, 2);
  
      document.getElementById("formspree-form").submit();
      document.getElementById("save-status").textContent = "Changes sent via email!";
  
    } catch (e) {
      console.error(e);
      document.getElementById("save-status").textContent = "Invalid JSON format!";
    }
  });
  
  // Reload when year changes
  yearSelect.addEventListener("change", () => loadYear(yearSelect.value));
  
  // Load default year on page load
  loadYear(yearSelect.value);
  