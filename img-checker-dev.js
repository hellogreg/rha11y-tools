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
    if (outputMessages && m) {
      console.group(m);
    } else {
      console.group();
    }
  }

  function groupCollapsed(m) {
    if (outputMessages && m) {
      console.groupCollapsed(m);
    } else {
      console.groupCollapsed();
    }
  }

  function groupEnd() {
    if (outputMessages) {
      console.groupEnd();
    }
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

  // Returns an element we can use, whether in the shadow DOM or not
  function getTestableElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

  // Test all the ways an element can be hidden from assistive tech.
  function isElementHidden(element) {
    let isHidden = false;

    const elementName = element.nodeName;
    groupCollapsed("Checking if " + elementName.toLowerCase() + " is hidden");

    // Check for hidden attribute
    const hasHiddenAttr = !!element.hidden;
    isHidden = isHidden || hasHiddenAttr;
    log("hidden attribute: " + hasHiddenAttr);

    const hasDisplayNone = getComputedStyle(element).display === "none";
    isHidden = isHidden || hasDisplayNone;
    log("display:none: " + hasDisplayNone);

    const hasVisibilityHidden = getComputedStyle(element).visibility === "hidden";
    isHidden = isHidden || hasVisibilityHidden;
    log("visbility:hidden: " + hasVisibilityHidden);

    const isAriaHidden = !!element.ariaHidden || element.getAttribute("aria-hidden") === "true";
    isHidden = isHidden || isAriaHidden;
    log("aria-hidden: " + isAriaHidden);

    // role="presentation" is only tested on the image itself -- not on parent elements
    if (isImg(element) || isSvg(element)) {
      const hasRolePresentation = element.getAttribute("role") === "presentation";
      isHidden = isHidden || hasRolePresentation;
      log("role=presentation: " + hasRolePresentation);
    }

    // TODO: Any other ways it could be hidden?

    groupEnd();
    return !!isHidden;
  }

  // Run up the DOM to check if the element or any parents are hidden
  //
  function isElementOrParentHidden(element) {
    function continueTesting(el) {
      return (
        !!el &&
        el.nodeName !== "BODY" &&
        el.nodeName !== "HTML" &&
        el.nodeType !== Node.DOCUMENT_NODE &&
        el.nodeName
      );
    }

    element = getTestableElement(element);
    let isHidden = false;

    groupCollapsed("Checking if <img> or parent is hidden from assistive tech");

    while (!isHidden && continueTesting(element)) {
      // Check if the element is hidden
      isHidden = isHidden || isElementHidden(element);

      // Now get the element's parent element for the next iteration
      element = element.parentNode ? element.parentNode : null;
      element = getTestableElement(element);

      if (!isHidden && continueTesting(element)) {
        log("Not hidden. Checking next parent: " + element.nodeName.toLowerCase());
      }
    }

    groupEnd();

    log("Either element or a parent is hidden from assistive tech: " + !!isHidden);
    return !!isHidden;
  }

  // Test whether an <img> element has an alt attribute, even if it's null
  //
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
  //
  function hasTitleElement(svg) {
    const hasTitle =
      svg.firstElementChild.tagName === "title" && !!svg.firstElementChild.textContent;
    log("Has <title>: " + !!hasTitle);
    if (hasTitle) {
      log("title: " + svg.firstElementChild.textContent);
    }
    return !!hasTitle;
  }

  // Test whether an element has role="img"
  //
  function hasImgRole(element) {
    const hasImgRole = element.getAttribute("role") === "img";
    log("Has role=img (not required/sufficient on its own): " + !!hasImgRole);
    return !!hasImgRole;
  }

  // Test whether an element has an aria-label
  //
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
  //
  function getAriaLabelledbyValue(id) {
    // See if we can locate the aria-labelledby's target element in regular DOM.
    let labelTarget = document.getElementById(id);
    // TODO: See if the target id is in a shadowRoot somewhere. Maybe use the elements array.

    let labelValue = labelTarget ? labelTarget.textContent : null;
    return labelValue;
  }

  // Test whether an element has an aria-labelledby attribute
  //
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
    // But we should check to make sure it has a _valid_ id and value.
    // Once hasAriaLabelledbyValue() can check shadowRoots (e.g., via elements array), use the following:
    // return !!hasAriaLabelledbyValue;
    // But for now, we're using this:
    return !!hasAriaLabelledby;
  }

  // Test if an image is accessible (has alt or is hidden)
  //
  function checkImgA11y(img) {
    let isAccessible = false;

    log(img.outerHTML);

    // Check if the img has an accessible name...
    group("Checking if <img> has an alt attribute");
    isAccessible = isAccessible || hasAltAttribute(img);
    groupEnd();

    // If no accessible name, check if the img or a parent is hidden...
    if (!isAccessible) {
      isAccessible = isElementOrParentHidden(img);
    }

    log("%c<img> is accessible: " + isAccessible, "font-weight:bold;");
    outputA11yResults(img, isAccessible);
  }

  // Test if an svg is accessible (has an accessible name/role or is hidden)
  //
  function checkSvgA11y(svg) {
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

    // If no accessible name, check if the SVG or a parent is hidden...
    if (!isAccessible) {
      isAccessible = isElementOrParentHidden(svg);
    }

    log("%c<svg> is accessible: " + isAccessible, "font-weight:bold;");
    outputA11yResults(svg, isAccessible);
  }

  // Fade out background images to indicate they are not tested
  //
  function fadeBackgroundImages(node) {
    node = getTestableElement(node);

    // Only fade images with a url/var value, not colors/gradients
    const styleBackground = window.getComputedStyle(node).background;
    const styleBackgroundImage = window.getComputedStyle(node).backgroundImage;
    if (
      node.style &&
      (styleBackground.match("url") ||
        styleBackgroundImage.match("url") ||
        styleBackgroundImage.match("var"))
    ) {
      group("Background image located");
      log("Background images don't require accessibility testing.");
      log("Fading out background image.");
      node.style.setProperty("background-color", "#fffd");
      node.style.setProperty("background-blend-mode", "color");
      groupEnd();
    }
  }

  function findAndTestImages(elements) {
    for (const element of elements) {
      if (isImg(element)) {
        group("<img> located");
        checkImgA11y(element);
        groupEnd();
      }

      if (isSvg(element)) {
        group("<svg> located");
        checkSvgA11y(element);
        groupEnd();
      }

      fadeBackgroundImages(element);
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
    group("rha11y-img-checker results");

    // By default, test all elements in the document body.
    const elements = getAllElements(document.body);
    findAndTestImages(elements);

    groupEnd();
  })();
})();
