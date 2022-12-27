javascript: (() => {
  // alt decision tree: https://www.w3.org/WAI/tutorials/images/decision-tree/

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
  log();

  function hasAltAttribute(img) {
    hasAlt = img.hasAttribute("alt");
    log("Has alt attribute: " + hasAlt);
    if (hasAlt) {
      log("Image's alt value: " + img.getAttribute("alt") || "[decorative]");
    }
    return hasAlt;
  }

  // Test all ways elements can be hidden from assistive tech...
  function isImageHidden(element) {
    let hidden = false;

    function isHidden(el) {
      let hid = false;

      hid = hid || el.ariaHidden; // aria-hidden="true"
      hid = hid || el.hidden; // hidden attribute
      hid = hid || el.getAttribute("role") === "presentation"; // role="presentation"
      hid = hid || getComputedStyle(el).display === "none"; // display: none
      // TODO: Any other ways it could be hidden?

      log(el.nodeName + " is hidden: " + hid);
      return hid;
    }

    function areAnyParentsHidden(el) {
      let hid = false;
      let parent = el.parentNode;
      log("Checking if parents are hidden");
      while (!hid && parent.nodeName !== "BODY" && parent.nodeName) {
        hid = hid || isHidden(parent);
        parent = parent.parentNode;
      }
      return hid;
    }

    hidden = hidden || isHidden(element);

    hidden = hidden || areAnyParentsHidden(element);

    return hidden;
  }

  function isImgAccessible(img) {
    let isAccessible = false;
    log("Checking if image is accessible");
    log(img.src);

    isAccessible = isAccessible || hasAltAttribute(img) || isImageHidden(img);

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

  function highlightElement(element, color) {
    color = color || "#ffffff";
    element.style.setProperty("outline", color + " solid 8px", "important");
  }

  function checkNonShadowImages() {
    // Get all non-shadow imgs
    const imgs = document.querySelectorAll("img");
    for (const img of imgs) {
      log("Accessible: " + isImgAccessible(img));
      highlightElement(img, "#f90");
      log();
    }

    // Get all non-shadow svgs
    const svgs = document.querySelectorAll("svg");
    for (const svg of svgs) {
      log("Accessible: " + isSvgAccessible(svg));
      highlightElement(svg, "#ff0");
      log();
    }
  }

  // Get every img and svg that's in a shadowRoot.
  function checkShadowImages() {
    var nodes = document.querySelectorAll("*");
    for (const node of nodes) {
      if (node.shadowRoot) {
        const imgs = node.shadowRoot.querySelectorAll("img");
        for (const img of imgs) {
          log("Accessible: " + isImgAccessible(img));
          highlightElement(img, "#0a0");
          log();
        }

        const svgs = node.shadowRoot.querySelectorAll("svg");
        for (const svg of svgs) {
          log("Accessible: " + isSvgAccessible(svg));
          highlightElement(svg, "#06f");
          log();
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
