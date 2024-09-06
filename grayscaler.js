javascript: (() => {
  // The grayscaler bookmarklet toggles a grayscale filter on and off for all elements.
  function toggleGrayscale() {
    var graystyle = document.getElementById("graystyle");

    if (!graystyle) {
      const style = document.createElement("style");
      style.setAttribute("id", "graystyle");
      style.textContent =
        ".grayscale { -webkit-filter: grayscale(100%) !important; filter: grayscale(100%) !important; -moz-filter: grayscale(100%) !important;}";
      document.head.appendChild(style);
    }

    document.documentElement.classList.toggle("grayscale");
  }

  (function init() {
    toggleGrayscale();
  })();
})();
