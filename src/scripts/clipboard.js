/**
 * Copies given text to the clipboard and shows a temporary status message.
 * Falls back to alert on failure.
 * 
 * @param {string} text - Text to copy.
 */
export function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      const status = document.getElementById("copy-status");
      if (status) {
        status.style.display = "inline";
        setTimeout(() => {
          status.style.display = "none";
        }, 2000);
      }
    })
    .catch(() => {
      alert("Could not copy to clipboard.");
    });
}
