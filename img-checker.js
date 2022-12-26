javascript: (() => {
  const outputMessagesDefault = true;
  let outputMessages = outputMessagesDefault;

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

  function getAllParents(node) {
    var arr = [];
    for (var n in node) {
      node = node.parentNode;
      if (node.nodeName == "BODY")
        // return if the element is the body element
        break;
      arr.push(node);
      log(node.nodeName);
    }
  }

  function hasAltAttribute(img) {
    return img.hasAttribute("alt");
  }

  function getAltAttribute(img) {
    return img.getAttribute("alt") || "[decorative image]";
  }

  // Test all ways elements can be hidden from assistive tech...
  function isElementHiddenFromAT(el) {
    let hidden = false;

    function isHidden(e) {
      let h = false;
      h = h || el.ariaHidden; // Check for aria-hidden="true"
      h = h || el.hidden; // Check for hidden attribute
      h = h || el.getAttribute("role") === "presentation";
      log("testing isHidden");
      return h;
    }

    hidden = hidden || isHidden(el);

    log("Checking " + el.nodeName);
    // TODO: Check if any parent elements are aria-hidden="true"? If so, turn outputMessages to false when running tests on parents.
    //TODO: use for in like getAllParents(el);
    let par = el.parentNode;
    if (par.nodeName !== "BODY") {
      log(par.nodeName);
      hidden = hidden || isHidden(par);
    }

    // TODO: Check for display: none
    // TODO: What other ways could it be hidden???
    return hidden;
  }

  function isImgAccessible(img) {
    let isAccessible = false;
    log(img.src);

    if (hasAltAttribute(img)) {
      isAccessible = true;
      log("Image has alt attribute: " + getAltAttribute(img));
    }

    if (isElementHiddenFromAT(img)) {
      isAccessible = true;
      log("Image is hidden from assistive tech.");
    }

    if (isAccessible) {
      log("Image is accessible.");
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

  function checkNonShadowImages() {
    // Get all non-shadow imgs
    const imgs = document.querySelectorAll("img");
    for (const img of imgs) {
      log("Accessible: " + isImgAccessible(img));
      highlightElement(img, "#f90");
    }

    // Get all non-shadow svgs
    const svgs = document.querySelectorAll("svg");
    for (const svg of svgs) {
      log("Accessible: " + isSvgAccessible(svg));
      highlightElement(svg, "#ff0");
    }
  }

  // Get every img and svg that's in a shadowRoot.
  function checkShadowImages() {
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
  }

  (function init() {
    checkNonShadowImages();
    checkShadowImages();
  })();

  log("Concluding image test bookmarklet.");
})();
