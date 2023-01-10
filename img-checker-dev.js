javascript: (() => {
  //
  // outputMessages toggles whether log() and dir() output anything
  let outputMessagesDefault = true;
  let outputMessages = outputMessagesDefault;

  // Custom log() and dir() functions, so we don't have to prepend with console
  //
  function log(m) {
    if (outputMessages) {
      m = m !== undefined ? m : " \n------------------------------";
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

  // Returns whether a tested element is a document-fragment
  function isDocumentFragment(node) {
    return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }

  // Returns whether a node is in the shadow DOM
  function hasShadowRoot(node) {
    return !!node.shadowRoot;
  }

  // Test all the ways an element can be hidden from assistive tech.
  function isElementHidden(element) {
    let isHidden = false;
    element = isDocumentFragment(element) ? element.getRootNode().host : element;

    const elementName = element.nodeName;
    log("Checking if " + elementName + " is hidden");
    //dir(element);

    // Check for hidden attribute
    const hasHiddenAttr = !!element.hidden;
    isHidden = isHidden || hasHiddenAttr;
    log(" - hidden attribute: " + hasHiddenAttr);

    const hasDisplayNone = getComputedStyle(element).display === "none";
    isHidden = isHidden || hasDisplayNone;
    log(" - display:none: " + hasDisplayNone);

    const isAriaHidden = !!element.ariaHidden || element.getAttribute("aria-hidden") === "true";
    isHidden = isHidden || isAriaHidden;
    log(" - aria-hidden: " + isAriaHidden);

    const hasRolePresentation = element.getAttribute("role") === "presentation";
    isHidden = isHidden || hasRolePresentation;
    log(" - role=presentation: " + hasRolePresentation);

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

    element = isDocumentFragment(element) ? element.getRootNode().host : element;
    let isHidden = false;

    while (!isHidden && continueTesting(element)) {
      // Check if the element is hidden
      isHidden = isHidden || isElementHidden(element);

      // Now get the element's parent element for the next iteration
      element = element.parentNode ? element.parentNode : null;
      element = isDocumentFragment(element) ? element.getRootNode().host : element;

      if (!isHidden && continueTesting(element)) {
        log("Next parent: " + element.nodeName);
      }
    }

    log("Either element or a parent is hidden: " + !!isHidden);
    return !!isHidden;
  }

  // Test whether an <img> element has an alt attribute, even if it's null
  function hasAltAttribute(img) {
    const hasAlt = !!img.hasAttribute("alt");
    log(" - Has alt attribute: " + hasAlt);
    if (hasAlt) {
      const altValue = img.getAttribute("alt") || "[decorative]";
      log(" - Image alt value: " + altValue);
    }
    return !!hasAlt;
  }

  // Test whether an <svg> element has a <title> as its first child element
  function hasTitleElement(svg) {
    const hasTitle =
      svg.firstElementChild.tagName === "title" && !!svg.firstElementChild.textContent;
    log(" - Has <title>: " + !!hasTitle);
    if (hasTitle) {
      log(" - title: " + svg.firstElementChild.textContent);
    }
    return !!hasTitle;
  }

  // Test whether an element has role="img"
  function hasImgRole(element) {
    const hasImgRole = element.getAttribute("role") === "img";
    log(" - Has role=img (not required/sufficient on its own): " + !!hasImgRole);
    return !!hasImgRole;
  }

  // Test whether an element has an aria-label
  function hasAriaLabel(element) {
    const ariaLabel = element.ariaLabel || element.getAttribute("aria-label");
    const hasAriaLabel = !!ariaLabel;
    log(" - Has aria-label: " + hasAriaLabel);
    if (hasAriaLabel) {
      log(" - aria-label: " + ariaLabel);
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
    log(" - Has aria-labelledby: " + hasAriaLabelledby);

    // Get the label value if the element has aria-labelledby attribute.
    let ariaLabelledbyValue;
    let hasAriaLabelledbyValue = null;
    if (hasAriaLabelledby) {
      ariaLabelledbyValue = getAriaLabelledbyValue(ariaLabelledbyId);
      hasAriaLabelledbyValue = !!ariaLabelledbyValue;
      log(" - aria-labelledby id: " + ariaLabelledbyId);
      log(" - aria-labelledby value: " + ariaLabelledbyValue);
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

    log("Checking if <img> is accessible");
    isAccessible = isAccessible || hasAltAttribute(img);
    isAccessible = isAccessible || isElementOrParentHidden(img);

    log("<img> is accessible: " + isAccessible);
    outputA11yResults(img, isAccessible);
  }

  // Test if an svg is accessible (has an accessible name/role or is hidden)
  //
  function checkSvgA11y(svg) {
    log("Checking if inline <svg> is accessible");

    let isAccessible = false;

    // Check if the SVG has an accessible name...
    hasImgRole(svg); // Not currently required, but still worth checking.
    isAccessible = isAccessible || !!hasTitleElement(svg);
    isAccessible = isAccessible || !!hasAriaLabel(svg);
    isAccessible = isAccessible || !!hasAriaLabelledby(svg);
    // TODO: Any other ways for an svg to be accessible?

    // If no accessible name, check if the SVG or a parent is hidden...
    isAccessible = isAccessible || isElementOrParentHidden(svg);

    log("<svg> is accessible: " + isAccessible);
    outputA11yResults(svg, isAccessible);
  }

  // Fade out background images to indicate they are not tested
  //
  function fadeBackgroundImages(node) {
    node = isDocumentFragment(node) ? node.getRootNode().host : node;

    // Only fade images with a url/var value, not colors/gradients
    if (
      node.style &&
      (node.style.backgroundImage.match("url") ||
        node.style.background.match("url") ||
        node.style.backgroundImage.match("var"))
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
      if (node.nodeName.toLowerCase() === "img") {
        log();
        log("Located an <img>");
        log(node.outerHTML);
        checkImgA11y(node);
      }

      if (node.nodeName.toLowerCase() === "svg") {
        log();
        log("Located an <svg>");
        log(node.outerHTML);
        checkSvgA11y(node);
      }

      if (hasShadowRoot(node)) {
        const shadowNode = node.shadowRoot;
        const rootName = shadowNode.getRootNode().host.nodeName || "[unspecified]";
        rootLevel += 1;
        log();
        log("Checking " + rootName + " shadowRoot at nesting level " + rootLevel);
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
    log("Initiating Rha11y-img bookmarklet");
    log();

    // By default, we want to test all elements in the document body.
    const root = document.body;
    findAndTestImages(root);
  })();
})();
