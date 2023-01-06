javascript: (() => {
  const outputMessagesDefault = true;
  let outputMessages = outputMessagesDefault;

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

  // Returns whether a tested element is a document-fragment
  function isShadowElement(element) {
    return element.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }

  // Display the test results: outline around image and data-a11y attribute in element
  function outputA11yResults(element, accessible) {
    // Add a data-a11y attribute to the element.
    // This attribute lists test results for someone inspecting the element.
    // TODO: Add more detail to the results.
    //
    element.setAttribute("data-a11y", "Accessible: " + !!accessible);

    // Outline the image with the pass/fail color.
    //
    const colorPass = "#09fd";
    const colorFail = "#f90d";
    const outlineColor = !!accessible ? colorPass : colorFail;
    element.style.setProperty("outline", outlineColor + " solid 8px", "important");
    element.style.setProperty("outline-offset", "-4px", "important");
    element.style.setProperty("border-radius", "2px", "important");

    // Remove any current filters on the element, because they affect outline color, too.
    element.style.setProperty("filter", "initial", "important");
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

  // Test all the ways elements can be hidden from assistive tech.
  function isElementOrParentHidden(element) {
    function isThisHidden(el) {
      let hidden = false;

      const elementName = isShadowElement(el) ? el.host.nodeName : el.nodeName;
      log("Checking if " + elementName + " is hidden");
      //dir(el);

      // Check for hidden attribute
      const hasHiddenAttr = !!el.hidden;
      hidden = hidden || hasHiddenAttr;
      log(" - Has hidden attribute: " + hasHiddenAttr);

      // Run tests specific to shadow and non-shadow elements
      if (isShadowElement(el)) {
        log("Running shadow-specific hidden tests");

        const isAriaHidden = !!el.ariaHidden;
        hidden = hidden || isAriaHidden;
        log(" - aria-hidden: " + isAriaHidden);

        const isHostAriaHidden = !!el.getRootNode().host.ariaHidden;
        hidden = hidden || isHostAriaHidden;
        log(" - getRootNode().host.ariaHidden: " + isHostAriaHidden);
      } else {
        log("Running non-shadow hidden tests");

        const hasDisplayNone = getComputedStyle(el).display === "none";
        hidden = hidden || hasDisplayNone;
        log(" - display:none: " + hasDisplayNone);

        const isAriaHidden = !!el.ariaHidden || el.getAttribute("aria-hidden") === "true";
        hidden = hidden || isAriaHidden;
        log(" - aria-hidden: " + isAriaHidden);

        const hasRolePresentation = el.getAttribute("role") === "presentation";
        hidden = hidden || hasRolePresentation;
        log(" - role=presentation: " + hasRolePresentation);
      }

      // TODO: Any other ways it could be hidden?

      return !!hidden;
    }

    let isHidden = false;

    // Check if element *or any parents* are hidden
    while (
      !isHidden &&
      !!element &&
      element.nodeName !== "BODY" &&
      element.nodeName !== "HTML" &&
      element.nodeType !== Node.DOCUMENT_NODE &&
      element.nodeName
    ) {
      // Check if the element is hidden
      isHidden = isHidden || isThisHidden(element);

      // Now get the element's parent element for the next iteration
      if (element.parentNode) {
        element = element.parentNode;
      } else if (isShadowElement(element)) {
        element = element.getRootNode().host.parentNode;
      } else {
        element = null;
      }

      if (!isHidden && element) {
        const parentName = isShadowElement(element) ? element.host.nodeName : element.nodeName;
        log("Next parent: " + parentName);
      }
    }

    log("Either element or a parent is hidden: " + isHidden);
    return !!isHidden;
  }

  // Test if an image is accessible (has alt or is hidden)
  function checkImgA11y(img) {
    let isAccessible = false;

    log("Checking if <img> is accessible");

    isAccessible = !!(hasAltAttribute(img) || isElementOrParentHidden(img));
    log("Image is accessible: " + isAccessible);
    outputA11yResults(img, isAccessible);
  }

  // Test if an svg is accessible (has an accessible name/role or is hidden)
  function checkSvgA11y(svg) {
    function hasTitle(s) {
      const title = s.querySelector("svg > title");
      const hasTitle = title && title.textContent;
      log(" - Has <title>: " + !!hasTitle);
      if (hasTitle) {
        const titleText = svg.querySelector("svg > title").textContent || "[unspecified]";
        log(" - title: " + titleText);
      }
      return !!hasTitle;
    }

    function hasImgRole(s) {
      const hasImgRole = s.getAttribute("role") === "img";
      log(" - Has role=img: " + !!hasImgRole);
      return !!hasImgRole;
    }

    function hasAriaLabel(s) {
      const ariaLabel = s.ariaLabel || s.getAttribute("aria-label");
      const hasAriaLabel = !!ariaLabel;
      log(" - Has aria-label: " + hasAriaLabel);
      if (hasAriaLabel) {
        log(" - aria-label: " + ariaLabel);
      }
      return !!hasAriaLabel;
    }

    function hasAriaLabelledby(s) {
      function getAriaLabelledbyValue(id) {
        let value;

        // See if the aria-labelledby element is within the SVG itself.
        value = value || s.getElementById(id) ? s.getElementById(id).textContent : null;

        // See if the aria-labelledby element is elsewhere in the page (excepting shadoRoots).
        value =
          value || document.getElementById(id) ? document.getElementById(id).textContent : null;

        // TODO: See if the aria-labelledby element is in a shadowRoot somewhere.

        return value;
      }

      const ariaLabelledbyId = s.ariaLabelledby || s.getAttribute("aria-labelledby");
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

    log("Checking if inline <svg> is accessible");

    let isAccessible = false;

    isAccessible = !!(hasTitle(svg) && !!hasImgRole(svg));
    isAccessible = isAccessible || !!hasAriaLabel(svg);
    isAccessible = isAccessible || !!hasAriaLabelledby(svg);

    // TODO: Any other ways for an svg to be accessible?

    isAccessible = isAccessible || isElementOrParentHidden(svg);

    log("svg is accessible: " + isAccessible);
    outputA11yResults(svg, isAccessible);
  }

  function findAndTestImages(node) {
    const svgs = node.querySelectorAll("svg");
    for (const svg of svgs) {
      log("Located an <svg>");
      log(svg.outerHTML);
      checkSvgA11y(svg);
      log();
    }

    // Get all non-shadow imgs
    const imgs = node.querySelectorAll("img");
    for (const img of imgs) {
      log("Located an <img>");
      log(img.outerHTML);
      checkImgA11y(img);
      log();
    }

    if (svgs.length === 0 && imgs.length === 0) {
      log("No <img> or <svg> elements within");
      log();
    }
  }

  function findAndTestNonShadowImages() {
    // By default, we want to test all images in the whole document.
    // Change this parameter to narrow the scope.
    findAndTestImages(document);
  }

  // Get all imgs and svgs in top-level and nested shadowRoots.
  function findAndTestShadowImages() {
    // Find shadowRoots nested within other shadowRoots
    function findNestedShadowRoots(root, level) {
      level = level + 1 || 1;
      const nodes = root.querySelectorAll("*");
      for (const node of nodes) {
        const shadowNode = node.shadowRoot;
        if (shadowNode) {
          const rootName = shadowNode.host.nodeName || "[unspecified]";
          const rootId = shadowNode.host.id || "[unspecified]";
          log("Found a nested shadowRoot (nesting level " + level + "): " + rootName);
          log("id: " + rootId);

          findAndTestImages(shadowNode);

          // Keep checking for more nesting levels.
          findNestedShadowRoots(shadowNode, i);
        }
      }
    }

    // Get all elements on page and then check to see if they have shadowRoots
    const nodes = document.querySelectorAll("*");
    for (const node of nodes) {
      const shadowNode = node.shadowRoot;
      if (shadowNode) {
        const rootName = shadowNode.host.nodeName || "[unspecified]";
        const rootId = shadowNode.host.id || "[unspecified]";
        log("Found a shadowRoot: " + rootName);
        log("id: " + rootId);

        findAndTestImages(shadowNode);

        findNestedShadowRoots(shadowNode);
      }
    }
  }

  // Fade out background images to indicate they are not tested
  function fadeBackgroundImages() {
    const nodes = document.querySelectorAll("*");
    for (const node of nodes) {
      // Only fade images with a url, and not just colors/gradients
      if (node.style.backgroundImage.match("url") || node.style.background.match("url")) {
        log("Background image found. They are not tested.");
        node.style.setProperty("background-color", "#fffd");
        node.style.setProperty("background-blend-mode", "color");
      }
    }
  }

  (function init() {
    log("Initiating Rha11y-img bookmarklet");
    log();
    findAndTestNonShadowImages();
    findAndTestShadowImages();
    fadeBackgroundImages();
  })();
})();
