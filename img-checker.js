javascript: (() => {
  console.log("Initiating image test bookmarklet.");

  function highlightElement(el, color) {
    color = color || "#ffffff";
    el.style.setProperty("outline", color + " solid 8px", "important");
  }

  // Get all non-shadow imgs
  //
  const imgs = document.querySelectorAll("img");
  for (const img of imgs) {
    highlightElement(img, "#f90");
    dir(img);
  }

  // Get all non-shadow svgs
  //
  const svgs = document.querySelectorAll("svg");
  for (const svg of svgs) {
    highlightElement(svg, "#ff0");
  }

  // Get every img and svg that's in a shadowRoot.
  //
  var nodes = document.querySelectorAll("*");
  for (const node of nodes) {
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
