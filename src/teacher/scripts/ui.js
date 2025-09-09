// -----------------------------
// UI helper functions
// -----------------------------
export function setLoggedIn(username) {
    const loggedInEl = document.getElementById("logged-in-user");
    loggedInEl.textContent = `Logged in as ${username}`;
  }
  
  export function displayBullets(data) {
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
  
  export function parseBulletsToJSON(div) {
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
  