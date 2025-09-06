import { teachers } from "./credentials.js";

export function handleLogin(formId, statusId, redirectUrl) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (teachers[user] && teachers[user].password === pass) {
      localStorage.setItem("teacherSubjects", JSON.stringify(teachers[user].subjects));
      localStorage.setItem("username", teachers[user].fullName);
      window.location.href = redirectUrl;
    } else {
      status.textContent = "Invalid username or password";
    }
  });
}
