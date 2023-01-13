javascript: (() => {
  //
  // outputMessages toggles whether log() and dir() output anything
  let outputMessagesDefault = true;
  let outputMessages = outputMessagesDefault;

  // Custom log() and dir() functions, so we don't have to prepend with console
  //
  function log(m) {
    if (outputMessages) {
      m = m !== undefined ? m : " ";
      console.log(m);
    }
  }

  function dir(m) {
    if (outputMessages && m) {
      console.dir(m);
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

  // Returns whether a node is in the shadow DOM
  function hasShadowRoot(node) {
    return !!node.shadowRoot;
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
    //element = getTestableElement(element);

    const elementName = element.nodeName;
    log("  Checking if " + elementName.toLowerCase() + " is hidden");
    //dir(element);

    // Check for hidden attribute
    const hasHiddenAttr = !!element.hidden;
    isHidden = isHidden || hasHiddenAttr;
    log("  - hidden attribute: " + hasHiddenAttr);

    const hasDisplayNone = getComputedStyle(element).display === "none";
    isHidden = isHidden || hasDisplayNone;
    log("  - display:none: " + hasDisplayNone);

    const hasVisibilityHidden = getComputedStyle(element).visibility === "hidden";
    isHidden = isHidden || hasVisibilityHidden;
    log("  - visbility:hidden: " + hasVisibilityHidden);

    const isAriaHidden = !!element.ariaHidden || element.getAttribute("aria-hidden") === "true";
    isHidden = isHidden || isAriaHidden;
    log("  - aria-hidden: " + isAriaHidden);

    // role="presentation" is only tested on the image itself
    if (isImg(element) || isSvg(element)) {
      const hasRolePresentation = element.getAttribute("role") === "presentation";
      isHidden = isHidden || hasRolePresentation;
      log("  - role=presentation: " + hasRolePresentation);
    }

    // TODO: Any other ways it could be hidden?

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

    while (!isHidden && continueTesting(element)) {
      // Check if the element is hidden
      isHidden = isHidden || isElementHidden(element);

      // Now get the element's parent element for the next iteration
      element = element.parentNode ? element.parentNode : null;
      element = getTestableElement(element);

      if (!isHidden && continueTesting(element)) {
        log("Next parent: " + element.nodeName.toLowerCase());
      }
    }

    log("Either element or a parent is hidden: " + !!isHidden);
    return !!isHidden;
  }

  // Test whether an <img> element has an alt attribute, even if it's null
  function hasAltAttribute(img) {
    const hasAlt = !!img.hasAttribute("alt");
    log("  - Has alt attribute: " + hasAlt);
    if (hasAlt) {
      const altValue = img.getAttribute("alt") || "[decorative]";
      log("  - Image alt value: " + altValue);
    }
    return !!hasAlt;
  }

  // Test whether an <svg> element has a <title> as its first child element
  function hasTitleElement(svg) {
    const hasTitle =
      svg.firstElementChild.tagName === "title" && !!svg.firstElementChild.textContent;
    log("  - Has <title>: " + !!hasTitle);
    if (hasTitle) {
      log("  - title: " + svg.firstElementChild.textContent);
    }
    return !!hasTitle;
  }

  // Test whether an element has role="img"
  function hasImgRole(element) {
    const hasImgRole = element.getAttribute("role") === "img";
    log("  - Has role=img (not required/sufficient on its own): " + !!hasImgRole);
    return !!hasImgRole;
  }

  // Test whether an element has an aria-label
  function hasAriaLabel(element) {
    const ariaLabel = element.ariaLabel || element.getAttribute("aria-label");
    const hasAriaLabel = !!ariaLabel;
    log("  - Has aria-label: " + hasAriaLabel);
    if (hasAriaLabel) {
      log("  - aria-label: " + ariaLabel);
    }
    return !!hasAriaLabel;
  }

  // Get an element's aria-labelledby value from its target
  function getAriaLabelledbyValue(id) {
    // See if we can locate the aria-labelledby's target element in regular DOM.
    let labelTarget = document.getElementById(id);
    // TODO: See if the target id is in a shadowRoot somewhere.

    let labelValue = labelTarget ? labelTarget.textContent : null;
    return labelValue;
  }

  // Test whether an element has an aria-labelledby attribute
  function hasAriaLabelledby(element) {
    const ariaLabelledbyId = element.ariaLabelledby || element.getAttribute("aria-labelledby");
    const hasAriaLabelledby = !!ariaLabelledbyId;
    log("  - Has aria-labelledby: " + hasAriaLabelledby);

    // Get the label value if the element has aria-labelledby attribute.
    let ariaLabelledbyValue;
    let hasAriaLabelledbyValue = null;
    if (hasAriaLabelledby) {
      ariaLabelledbyValue = getAriaLabelledbyValue(ariaLabelledbyId);
      hasAriaLabelledbyValue = !!ariaLabelledbyValue;
      log("  - aria-labelledby id: " + ariaLabelledbyId);
      log("  - aria-labelledby value: " + ariaLabelledbyValue);
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
  function checkImgA11y(img) {
    let isAccessible = false;

    // Check if the img has an accessible name...
    log("Checking if <img> has an alt attribute");
    isAccessible = isAccessible || hasAltAttribute(img);

    // If no accessible name, check if the img or a parent is hidden...
    if (!isAccessible) {
      log("Checking if <img> or parent is hidden from assistive tech");
      isAccessible = isElementOrParentHidden(img);
    }

    log("<img> is accessible: " + isAccessible);
    outputA11yResults(img, isAccessible);
  }

  // Test if an svg is accessible (has an accessible name/role or is hidden)
  //
  function checkSvgA11y(svg) {
    let isAccessible = false;

    // Check if the SVG has an accessible name...
    log("Checking if inline <svg> has an accessible name");
    hasImgRole(svg); // Not currently required, but still worth checking.
    isAccessible = isAccessible || !!hasTitleElement(svg);
    isAccessible = isAccessible || !!hasAriaLabel(svg);
    isAccessible = isAccessible || !!hasAriaLabelledby(svg);
    // TODO: Any other ways for an svg to be accessible?

    // If no accessible name, check if the SVG or a parent is hidden...
    if (!isAccessible) {
      log("Checking if <svg> or parent is hidden from assistive tech");
      isAccessible = isElementOrParentHidden(svg);
    }

    log("<svg> is accessible: " + isAccessible);
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
      log("Background image found. They are not tested.");
      //node.style.setProperty("background-image", "none");
      node.style.setProperty("background-color", "#fffd");
      node.style.setProperty("background-blend-mode", "color");
    }
  }

  let rootLevel = 0;
  function findAndTestImages(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      if (isImg(node)) {
        log();
        log("Located an <img>");
        log(node.outerHTML);
        checkImgA11y(node);
      }

      if (isSvg(node)) {
        log();
        log("Located an <svg>");
        log(node.outerHTML);
        checkSvgA11y(node);
      }

      if (hasShadowRoot(node)) {
        const shadowNode = node.shadowRoot;
        const rootName = shadowNode.getRootNode().host.nodeName || "[unspecified]";
        rootLevel += 1;
        log("Entering " + rootName + " shadowRoot at nesting level " + rootLevel);
        findAndTestImages(shadowNode);
      }

      fadeBackgroundImages(node);
    }

    let nodeName = root.getRootNode().host ? root.getRootNode().host.nodeName : null;
    if (rootLevel > 0 && nodeName) {
      log();
      log("Exiting " + nodeName + " shadowRoot at nesting level " + rootLevel);
      rootLevel -= 1;
    }
    log();
  }

  (function init() {
    log();
    log("Initiating rha11y-tools bookmarklet");
    log();

    // By default, we want to test all elements in the document body.
    const root = document.body;
    findAndTestImages(root);
  })();
})();
