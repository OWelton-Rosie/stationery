// rules.js
import { ERRORS } from './errors.js';
import { displayError } from './dom.js';

const FOREIGN_LANGUAGES = new Set(["Japanese", "Chinese", "Spanish"]);

/**
 * Enforces selection rules for a year, including Year 10 language/elective limits.
 */
export function enforceSelectionRules(year, mandatoryCount, subjectsDiv, resultDiv) {
  const checkboxes = subjectsDiv.querySelectorAll('input[name="subject"]');

  checkboxes.forEach(checkbox => {
    if (checkbox.disabled) return;

    checkbox.addEventListener("change", () => {
      const electiveCheckboxes = [...checkboxes].filter(cb => !cb.disabled);
      const selected = electiveCheckboxes.filter(cb => cb.checked);
      const electiveSubjects = selected.map(cb => cb.value);
      const selectedLanguages = electiveSubjects.filter(sub => FOREIGN_LANGUAGES.has(sub));
      const electiveCount = electiveSubjects.length;

      if (year === "10") {
        let maxAllowed = selectedLanguages.length === 1 ? 3 : 4;

        if (selectedLanguages.length > 1) {
          checkbox.checked = false;
          displayError(resultDiv, ERRORS.tooManyLanguages);
          return;
        }

        if (electiveCount > maxAllowed) {
          checkbox.checked = false;
          displayError(resultDiv, ERRORS.tooManySubjectsYr10);
        } else {
          resultDiv.innerHTML = "";
        }

        electiveCheckboxes.forEach(cb => {
          if (!cb.checked) cb.disabled = electiveCount >= maxAllowed;
          else cb.disabled = false;
        });

        return;
      }

      if (selectedLanguages.length > 1) {
        checkbox.checked = false;
        displayError(resultDiv, ERRORS.tooManyLanguages);
        return;
      }

      if (electiveCount > (9 - mandatoryCount)) {
        checkbox.checked = false;
        displayError(resultDiv, ERRORS.tooManySubjects);
        return;
      }

      resultDiv.innerHTML = "";
    });
  });
}
