javascript: (() => {
  console.log("Initiating image test bookmarklet.");

  const imgs = document.querySelectorAll("img");
  for (const img of imgs) {
    img.style.outline = "#ff9900 solid 8px";
  }

  const svgs = document.querySelectorAll("svg");
  for (const svg of svgs) {
    svg.style.outline = "#ffff00 solid 8px";
  }

  var els = document.querySelectorAll("*");
  for (el of els) {
    if (el.shadowRoot) {
      const imgs = el.shadowRoot.querySelectorAll("img");
      for (const img of imgs) {
        img.style.outline = "#00aa00 solid 8px";
      }

      const svgs = el.shadowRoot.querySelectorAll("svg");
      for (const svg of svgs) {
        svg.style.outline = "#0066ff solid 8px";
      }
    }
  }
})();
