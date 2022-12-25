javascript: (() => {
  const outputMessagesDefault = true;
  let outputMessages = outputMessages;

  function log(m) {
    if (outputMessages) {
      m = m !== undefined ? m : "-----------------";
      console.log(m);
    }
  }

  function dir(m) {
    if (outputMessages && m) {
      console.dir(m);
    }
  }

  log("Initiating image test bookmarklet.");

  // Test all ways elements can be hidden from assistive tech...
  function isElementHiddenFromAT(el) {
    let hidden = false;
    hidden = hidden || el.ariaHidden; // Check for aria-hidden="true"
    hidden = hidden || el.hidden; // Check for hidden attribute
    hidden = hidden || el.getAttribute("role") === "presentation";
    // TODO: Check if any parent elements are aria-hidden="true"? If so, turn outputMessages to false when running tests on parents.
    // TODO: Check for display: none
    // TODO: What other ways could it be hidden???
    return hidden;
  }

  function getAltAttribute(img) {
    return img.getAttribute("alt") || "[decorative image]";
  }

  function isImageAccessible(img) {
    let isAccessible = false;
    dir(img);

    if (img.hasAttribute("alt")) {
      log("Image has alt attribute: " + getAltAttribute(img));
      isAccessible = true;
    } else if (isElementHiddenFromAT(img)) {
      log("Image is hidden from assistive tech.");
      isAccessible = true;
    } else {
      log("Image is not accessible.");
    }
    return isAccessible;
  }

  function isSvgAccessible(svg) {
    let isAccessible = false;
    //dir(svg);

    let title = svg.querySelector("svg > title");
    let hasTitle = title && title.textContent;
    let hasRoleImg = svg.getAttribute("role") === "img";

    isAccessible = isAccessible || (hasTitle && hasRoleImg);

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
    //log("Accessible: " + isImageAccessible(img));
    highlightElement(img, "#f90");
  }

  // Get all non-shadow svgs
  //
  const svgs = document.querySelectorAll("svg");
  for (const svg of svgs) {
    log("Accessible: " + isSvgAccessible(svg));
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

  // TODO: Create init function to run img location/test functions.

  log("Concluding image test bookmarklet.");
})();
