javascript: (() => {
  console.log("Initiating image test bookmarklet.");

  function highlightElement(el, color) {
    color = color || "#ffffff";
    el.style.outline = color + " solid 8px";
  }

  const imgs = document.querySelectorAll("img");
  for (const img of imgs) {
    img.style.outline = "#f90 solid 8px";
  }

  const svgs = document.querySelectorAll("svg");
  for (const svg of svgs) {
    svg.style.outline = "#ff0 solid 8px";
  }

  var nodes = document.querySelectorAll("*");
  for (node of nodes) {
    if (node.shadowRoot) {
      const imgs = node.shadowRoot.querySelectorAll("img");
      for (const img of imgs) {
        highlightElement(img, "#0a0");
      }

      const svgs = node.shadowRoot.querySelectorAll("svg");
      for (const svg of svgs) {
        highlightElement(svg, "#06f");
      }
    }
  }

  console.log("Concluding image test bookmarklet.");
})();
