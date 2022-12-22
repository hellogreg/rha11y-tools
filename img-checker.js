javascript: (() => {
  console.log("Initiating image test bookmarklet.");

  const images = document.querySelectorAll("img");
  for (const image of images) {
    image.style.outline = "#ff9900 solid 8px";
  }

  const svgs = document.querySelectorAll("svg");
  for (const svg of svgs) {
    svg.style.outline = "#ffff00 solid 8px";
  }

  var els = document.getElementsByTagName("*");
  for (el of els) {
    if (el.shadowRoot) {
      const shadowImages = el.shadowRoot.querySelectorAll("img");
      for (const shadowImage of shadowImages) {
        shadowImage.style.outline = "#00aa00 solid 8px";
      }

      const shadowSvgs = el.shadowRoot.querySelectorAll("svg");
      for (const shadowSvg of shadowSvgs) {
        shadowSvg.style.outline = "#0066ff solid 8px";
      }
    }
  }
})();
