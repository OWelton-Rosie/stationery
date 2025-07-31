/**
 * Copies the given text to the clipboard and shows a visual confirmation.
 *
 * @param {string} text - The text to copy to the clipboard.
 */
export function copyToClipboard(text) {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    alert("Clipboard API not supported by this browser.");
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => {
      const statusEl = document.getElementById("copy-status");
      if (!statusEl) return;

      statusEl.style.display = "inline";

      const timeoutId = setTimeout(() => {
        statusEl.style.display = "none";
      }, 2000);

      // Optional: store timeout ID on the element for potential later clearing
      statusEl.dataset.timeoutId = timeoutId.toString();
    })
    .catch((err) => {
      console.error("Failed to copy text:", err);
      alert("Could not copy to clipboard.");
    });
}
