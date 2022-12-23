javascript: (() => {
  function log(m) {
    m = m !== undefined ? m : "-----------------";
    console.log(m);
  }

  function dir(m) {
    if (m) {
      console.dir(m);
    }
  }

  log("Initiating image test bookmarklet.");

  function isElementAriaHidden(el) {
    let hidden = false;
    hidden = el.ariaHidden; // Check for aria-hidden="true"
    hidden = hidden || el.hidden; // Check for hidden attribute
    hidden = hidden || el.getAttribute("role") === "presentation";
    // TODO: Check if any parent elements are aria-hidden="true"?
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
    } else if (isElementAriaHidden(img)) {
      log("Image is aria-hidden.");
      isAccessible = true;
    } else {
      log("Image requires alt attribute.");
    }
    return isAccessible;
  }

  function isSvgAccessible(svg) {
    let isAccessible = false;
    //dir(svg);

    // TODO: https://stackoverflow.com/questions/56912948/how-to-get-role-presentation-elements
    log(svg.ariaRoleDescription);
    let title = svg.querySelector("svg > title");
    log(title);
    log(!!svg.querySelector("svg[role='presentation']"));
    log(!!svg.querySelector("svg[role='img']"));

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

  log("Concluding image test bookmarklet.");
})();
