javascript: (() => {
  console.log("Initiating image test bookmarklet.");

  function highlightElement(img, color) {
    color = color || "#ffffff";
    img.style.outline = color + " solid 8px";
  }

  const imgs = document.querySelectorAll("img");
  for (const img of imgs) {
    img.style.outline = "#f90 solid 8px";
  }

  const svgs = document.querySelectorAll("svg");
  for (const svg of svgs) {
    svg.style.outline = "#ff0 solid 8px";
  }

  var els = document.querySelectorAll("*");
  for (el of els) {
    if (el.shadowRoot) {
      const imgs = el.shadowRoot.querySelectorAll("img");
      for (const img of imgs) {
        highlightElement(img, "#0a0");
      }

      const svgs = el.shadowRoot.querySelectorAll("svg");
      for (const svg of svgs) {
        svg.style.outline = highlightElement(img, "#06f");
      }
    }
  }

  console.log("Concluding image test bookmarklet.");
})();
