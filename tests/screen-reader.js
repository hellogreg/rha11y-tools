javascript: (() => {
  //
  // outputMessages toggles whether log() and dir() output anything
  let outputMessagesDefault = true;
  let outputMessages = outputMessagesDefault;

  // Custom log(), dir(), group(), and groupEnd() functions, so we don't have to prepend with console
  //
  function log(m, s) {
    if (outputMessages) {
      m = m !== undefined ? m : " ";
      if (s) {
        console.log(m, s);
      } else {
        console.log(m);
      }
    }
  }

  function dir(m) {
    if (outputMessages && m) {
      console.dir(m);
    }
  }

  function group(m) {
    if (m) {
      console.group(m);
    } else {
      console.group();
    }
  }

  function groupCollapsed(m) {
    if (m) {
      console.groupCollapsed(m);
    } else {
      console.groupCollapsed();
    }
  }

  function groupEnd() {
    console.groupEnd();
  }

  // Display the test results: outline around image and data-a11y attribute in element
  //
  function outputA11yResults(element, accessible) {
    // The data-a11y attribute lists test results for someone inspecting the element.
    // TODO: Add more detail to the results.
    element.setAttribute("data-a11y", "Accessible: " + !!accessible);

    // Outline the image with the pass/fail color.
    // (Must reset filters on image, too, to ensure proper outlining)
    //
    const colorPass = "#09fd";
    const colorFail = "#f90d";
    const outlineColor = !!accessible ? colorPass : colorFail;
    element.style.setProperty("outline", outlineColor + " solid 8px", "important");
    element.style.setProperty("outline-offset", "-4px", "important");
    element.style.setProperty("border-radius", "2px", "important");
    element.style.setProperty("filter", "initial", "important");
  }

  function isImg(element) {
    return element.nodeName.toLowerCase() === "img";
  }

  function isSvg(element) {
    return element.nodeName.toLowerCase() === "svg";
  }

  // Returns whether a node is in the shadow DOM
  function hasShadowRoot(node) {
    return !!node.shadowRoot;
  }

  // Returns an element we can use, whether in the shadow DOM or not
  function getUsableElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

  // Test all the ways an element can be hidden from assistive tech.
  function isElementHidden(element) {
    let isHidden = false;
    element = getUsableElement(element);

    // Check for hidden attribute
    const hasHiddenAttr = !!element.hidden;
    isHidden = isHidden || hasHiddenAttr;

    const hasDisplayNone = getComputedStyle(element).display === "none";
    isHidden = isHidden || hasDisplayNone;

    const hasVisibilityHidden = getComputedStyle(element).visibility === "hidden";
    isHidden = isHidden || hasVisibilityHidden;

    const isAriaHidden = !!element.ariaHidden || element.getAttribute("aria-hidden") === "true";
    isHidden = isHidden || isAriaHidden;

    // role="presentation" is only tested on the image itself
    // TODO: Break this out into its own thing, since the role isn't inherited by children.
    // How do we hide/remove this -- but not its children?
    /*
    if (isImg(element) || isSvg(element)) {
      const hasRolePresentation = element.getAttribute("role") === "presentation";
      isHidden = isHidden || hasRolePresentation;
      log("role=presentation: " + hasRolePresentation);
    }
    */

    // TODO: Any other ways it could be hidden?

    return !!isHidden;
  }

  // Test whether an <img> element has an alt attribute, even if it's null
  function hasAltAttribute(img) {
    const hasAlt = !!img.hasAttribute("alt");
    log("Has alt attribute: " + hasAlt);
    if (hasAlt) {
      const altValue = img.getAttribute("alt") || "[decorative]";
      log("Image alt value: " + altValue);
    }
    return !!hasAlt;
  }

  // Test whether an <svg> element has a <title> as its first child element
  function hasTitleElement(svg) {
    const hasTitle =
      svg.firstElementChild.tagName === "title" && !!svg.firstElementChild.textContent;
    return !!hasTitle;
  }

  // Test whether an element has role="img"
  function hasImgRole(element) {
    const hasImgRole = element.getAttribute("role") === "img";
    return !!hasImgRole;
  }

  // Test whether an element has an aria-label
  function hasAriaLabel(element) {
    const ariaLabel = element.ariaLabel || element.getAttribute("aria-label");
    const hasAriaLabel = !!ariaLabel;
    log("Has aria-label: " + hasAriaLabel);
    if (hasAriaLabel) {
      log("aria-label: " + ariaLabel);
    }
    return !!hasAriaLabel;
  }

  // Get an element's aria-labelledby value from its target
  function getAriaLabelledbyValue(id) {
    let labelTarget = document.getElementById(id);
    let labelValue = labelTarget ? labelTarget.textContent : null;
    return labelValue;
  }

  // Test whether an element has an aria-labelledby attribute
  function hasAriaLabelledby(element) {
    const ariaLabelledbyId = element.ariaLabelledby || element.getAttribute("aria-labelledby");
    const hasAriaLabelledby = !!ariaLabelledbyId;
    log("Has aria-labelledby: " + hasAriaLabelledby);

    // Get the label value if the element has aria-labelledby attribute.
    let ariaLabelledbyValue;
    let hasAriaLabelledbyValue = null;
    if (hasAriaLabelledby) {
      ariaLabelledbyValue = getAriaLabelledbyValue(ariaLabelledbyId);
      hasAriaLabelledbyValue = !!ariaLabelledbyValue;
      log("aria-labelledby id: " + ariaLabelledbyId);
      log("aria-labelledby value: " + ariaLabelledbyValue);
    }

    // TODO: We're currently returning true if there's an aria-labelledby attribute at all.
    // But we should check to make sure it has a valid id and value.
    // Once hasAriaLabelledbyValue() can check shadowRoots, use the following:
    // return !!hasAriaLabelledbyValue;
    // But for now, we're using this:
    return !!hasAriaLabelledby;
  }

  // Test if an image is accessible (has alt or is hidden)
  //
  function convertImg(img) {
    let isAccessible = false;

    log(img.outerHTML);

    // Check if the img has an accessible name...
    // TODO: If so, get it returned to use here!

    groupCollapsed("Checking if <img> has an alt attribute");
    isAccessible = isAccessible || hasAltAttribute(img);
    groupEnd();

    if (!isAccessible) {
      const txt = document.createElement("span");
      txt.innerHTML = "[INACCESSIBLE IMAGE]";
      img.parentNode.insertBefore(txt, img.nextSibling);
      img.remove();
    }

    outputA11yResults(img, isAccessible);
  }

  // Test if an svg is accessible (has an accessible name/role or is hidden)
  //
  function convertSvg(svg) {
    let isAccessible = false;

    log(svg.outerHTML);

    // Check if the SVG has an accessible name...
    group("Checking if inline <svg> has an accessible name");
    hasImgRole(svg); // TODO: Will we start requiring?
    isAccessible = isAccessible || !!hasTitleElement(svg);
    isAccessible = isAccessible || !!hasAriaLabel(svg);
    isAccessible = isAccessible || !!hasAriaLabelledby(svg);
    // TODO: Any other ways for an svg to be accessible?
    groupEnd();

    if (!isAccessible) {
      const txt = document.createElement("span");
      txt.innerHTML = "[INACCESSIBLE INLINE SVG]";
      svg.parentNode.insertBefore(txt, svg.nextSibling);
      svg.remove();
    }
    outputA11yResults(svg, isAccessible);
  }

  function outputImageText(element, message) {
    if (element && message) {
      const span = document.createElement("span");
      span.innerHTML = message;
      element.parentNode.insertBefore(element, svg.nextSibling);
      element.remove();
    }
  }

  // Fade out background images to indicate they are not tested
  //
  function cleanDefaultStyles(element) {
    if (element.style) {
      //node.style.setProperty("all", "unset");
      element.style.setProperty("background-image", "none");
      element.style.setProperty("background", "none");
      element.style.setProperty("color", "revert");
      element.style.setProperty("background-color", "revert");
      element.style.setProperty("font", "revert");
      element.style.setProperty("font-family", "system-ui, -apple-system, sans-serif");
      element.style.setProperty("line-height", "1.4");
    }
  }

  function hideElement(element) {
    log("Removing element: " + element.tagName);
    element.remove();
  }

  function convertContent(elements) {
    groupCollapsed("Cleaning body styles...");
    cleanDefaultStyles(document.body);
    groupEnd();

    for (let element of elements) {
      if (isElementHidden(element)) {
        hideElement(element);
      } else {
        cleanDefaultStyles(element);

        if (isImg(element)) {
          //group("<img> located");
          //convertImg(element);
          //groupEnd();
        }

        if (isSvg(element)) {
          //group("<svg> located");
          //convertSvg(element);
          //groupEnd();
        }
      }
    }
  }

  function getAllElements(root) {
    function getElements(root) {
      const nodes = root.querySelectorAll("*");

      for (const node of nodes) {
        let element;

        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          element = node.getRootNode().host;
        } else {
          element = node;
        }

        if (element.nodeType === Node.ELEMENT_NODE) {
          allElements.push(element);
        }

        // If node has shadowRoot, re-call this function to get its child nodes.
        if (node.shadowRoot) {
          getElements(node.shadowRoot);
        }
      }
    }

    let allElements = [];
    if (root) {
      getElements(root);
    }
    return allElements;
  }

  (function init() {
    group("rha11y-screen-reader results");

    // By default, get all elements in the document body.
    const elements = getAllElements(document.body);
    convertContent(elements);

    groupEnd();
  })();
})();
