// dom.js
import { copyToClipboard } from './clipboard.js';

/**
 * Creates a checkbox element with label for a subject.
 */
export function createSubjectCheckbox(subject, isMandatory) {
  const checkboxId = `subject-${subject.replace(/\s+/g, "-")}`;
  const wrapper = document.createElement("div");
  wrapper.className = "subject-checkbox";

  const checkbox = Object.assign(document.createElement("input"), {
    type: "checkbox",
    id: checkboxId,
    name: "subject",
    value: subject,
    checked: isMandatory,
    disabled: isMandatory,
  });

  const label = Object.assign(document.createElement("label"), {
    htmlFor: checkboxId,
    textContent: `${subject}${isMandatory ? " (Required)" : ""}`,
  });

  wrapper.append(checkbox, label);
  return wrapper;
}

/**
 * Displays an error message inside a given container.
 */
export function displayError(container, message) {
  container.innerHTML = "";
  const error = document.createElement("p");
  error.style.color = "red";
  error.textContent = message;
  container.appendChild(error);
}

/**
 * Clears content from subjects container and result container.
 */
export function clearSubjectsAndResult(subjectsDiv, resultDiv) {
  subjectsDiv.innerHTML = "";
  resultDiv.innerHTML = "";
}

/**
 * Renders stationery list HTML and a copy button.
 */
export function renderResultList(resultDiv, html, text) {
  resultDiv.innerHTML = "";

  const container = document.createElement("div");
  container.className = "stationery-list-container";

  const heading = document.createElement("h2");
  heading.textContent = "Stationery List";

  const content = document.createElement("div");
  content.innerHTML = html;

  container.append(heading, content);

  const copyWrapper = document.createElement("div");
  copyWrapper.style.display = "flex";
  copyWrapper.style.alignItems = "center";
  copyWrapper.style.gap = "1rem";
  copyWrapper.style.marginTop = "1rem";

  const copyBtn = Object.assign(document.createElement("button"), {
    id: "copy-btn",
    textContent: "Copy List",
  });

  const status = Object.assign(document.createElement("span"), {
    id: "copy-status",
    style: "color: black; display: none;",
    textContent: "Copied to clipboard!",
  });
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  copyBtn.addEventListener("click", () => {
    copyToClipboard(text);
    status.style.display = "inline";
    setTimeout(() => (status.style.display = "none"), 2000);
  });

  copyWrapper.append(copyBtn, status);
  resultDiv.append(container, copyWrapper);
}
