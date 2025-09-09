// -----------------------------
// User authentication & logout
// -----------------------------
export function checkUser() {
    const username = localStorage.getItem("username");
    const teacherSubjects = JSON.parse(localStorage.getItem("teacherSubjects") || '["Maths","Sci","Eng"]');
  
    if (!username) {
      window.location.href = "login.html";
      return null;
    }
  
    if (!teacherSubjects.length) {
      document.body.innerHTML = "<h2>Access Denied</h2><p>No subjects assigned.</p>";
      throw new Error("No teacher subjects found.");
    }
  
    return { username, teacherSubjects };
  }
  
  export function setupLogout() {
    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.style.display = "inline-block";
    logoutBtn.style.background = "#e74c3c";
    logoutBtn.style.color = "white";
    logoutBtn.style.border = "none";
    logoutBtn.style.padding = "0.5rem 1rem";
    logoutBtn.style.marginTop = "0.5rem";
    logoutBtn.style.borderRadius = "6px";
    logoutBtn.style.cursor = "pointer";
  
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("username");
      localStorage.removeItem("teacherSubjects");
      window.location.href = "login.html";
    });
  }
  