import { checkUser, setupLogout } from "./auth.js";
import { setLoggedIn } from "./ui.js";
import { setupEditor } from "./editor.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = checkUser();
  if (!user) return;

  const subjectMap = {
    "Maths": "Mathematics",
    "Sci": "Science",
    "Eng": "English"
  };

  setLoggedIn(user.username);
  setupLogout();
  setupEditor(user.teacherSubjects, subjectMap);
});
