javascript: (() => {
  console.log("Initiating image test bookmarklet.");
  const images = document.querySelectorAll("img");

  for (const image of images) {
    image.style.outline = "#ff9900 solid 8px";
  }

  const svgs = document.querySelectorAll("svg");

  for (const svg of svgs) {
    svg.style.outline = "#ccFF00 solid 8px";
  }

  var allNodes = document.getElementsByTagName("*");
  for (node of allNodes) {
    if (node.shadowRoot) {
      const shadowImages = node.shadowRoot.querySelectorAll("img");
      for (const shadowImage of shadowImages) {
        shadowImage.style.outline = "#00aa00 solid 8px";
      }

      const shadowSvgs = node.shadowRoot.querySelectorAll("svg");
      for (const shadowSvg of shadowSvgs) {
        shadowSvg.style.outline = "#0099ff solid 8px";
      }
    }
  }
})();
