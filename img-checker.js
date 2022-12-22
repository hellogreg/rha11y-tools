javascript: (() => {
  console.log("Initiating image test bookmarklet.");

  function isElementAriaHidden(el) {
    let hidden = false;
    return hidden;
  }

  function getAltAttribute(img) {
    return img.getAttribute("alt") || "[Decorative Image]";
  }

  function isImageAccessible(img) {
    let isAccessible = false;
    if (img.hasAttribute("alt")) {
      console.log("Element has alt attribute: " + getAltAttribute(img));
      isAccessible = true;
    } else if (isElementAriaHidden(img)) {
      console.log("Element is aria-hidden.");
      isAccessible = true;
    } else {
      console.log("Alt tag needed!");
    }
    return isAccessible;
  }

  function highlightElement(el, color) {
    color = color || "#ffffff";
    el.style.setProperty("outline", color + " solid 8px", "important");
  }

  // Get all non-shadow imgs
  //
  const imgs = document.querySelectorAll("img");
  for (const img of imgs) {
    console.dir(img);
    console.log("Accessble: " + isImageAccessible(img));
    highlightElement(img, "#f90");
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
