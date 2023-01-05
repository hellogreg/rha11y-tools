javascript: (() => {
  // Give log() the ability to include line numbers.
  //const log = console.log.bind(window.console);

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
    let outlineColor = !!accessible ? colorPass : colorFail;
    element.style.setProperty("outline", outlineColor + " solid 8px", "important");
    element.style.setProperty("outline-offset", "-2px", "important");
    element.style.setProperty("border-radius", "2px", "important");

    // Remove any current filters on the element, because they affect outline color, too.
    element.style.setProperty("filter", "initial", "important");
  }

  // Test all the ways elements can be hidden from assistive tech.
  function isElementHidden(element) {
    function isHidden(el) {
      let hid;
      log("Checking if " + el.nodeName + " is hidden");

      // Check for hidden attribute
      hid = hid || !!el.hidden;

      // We use try/catch blocks below because web components may fail to execute tests.

      // Check for aria-hidden="true" and role="presentation"
      try {
        let ariaHidden = el.ariaHidden || el.getAttribute("aria-hidden") === "true";
        log("aria-hidden: " + !!ariaHidden);
        hid = hid || !!ariaHidden;
      } catch (e) {
        hid = hid || !!el.ariaHidden;
        log("aria-hidden: " + !!el.ariaHidden);
        log("Can't test " + el.nodeName + " for aria-hidden with getAttribute().");
      }

      // Check for role="presentation"
      try {
        hid = hid || el.getAttribute("role") === "presentation";
        log("role=presentation: " + (el.getAttribute("role") === "presentation"));
      } catch (e) {
        log("Can't test " + el.nodeName + " for role attribute.");
      }

      // Checks inline and external styles for display: none
      try {
        hid = hid || getComputedStyle(el).display === "none";
      } catch (e) {
        log("Can't test " + el.nodeName + " for computed style.");
      }

      // If shadowRoot element, checks host for ariaHidden
      try {
        hid = hid || !!el.getRootNode().host.ariaHidden;
        log("HIDDEN: " + !!el.getRootNode().host.ariaHidden);
      } catch (e) {
        log("Can't test " + el.nodeName + " for getRootNode().host.ariaHidden.");
      }

      // TODO: Any other ways it could be hidden?

      return !!hid;
    }

    // Test if any of the element's parent elements are hidden, thus hiding the element
    function areAnyParentsHidden(el) {
      let hid;
      let parent = el.parentNode;
      // To test for web component parent: parent.nodeType !== 11 {
      while (!hid && parent && parent.nodeName !== "BODY" && parent.nodeName) {
        log("Parent:");
        dir(parent);
        hid = hid || isHidden(parent);
        parent = parent.parentNode;
        dir(parent);
      }

      return !!hid;
    }

    let hidden = isHidden(element);
    log("Hidden from asst. tech: " + !!hidden);

    if (!hidden) {
      log("Checking if any parents are hidden");
      hidden = hidden || areAnyParentsHidden(element);
    }

    log("Element or parent is hidden: " + hidden);
    return !!hidden;
  }

  // Test if an svg is accessible (has an accessible name/role or is hidden)
  function checkSvgA11y(svg) {
    function hasTitle(s) {
      let title = s.querySelector("svg > title");
      let hasTitle = title && title.textContent;
      log("Has <title>: " + !!hasTitle);
      if (hasTitle) {
        let titleText = svg.querySelector("svg > title").textContent || "[unspecified]";
        log("title: " + titleText);
      }
      return !!hasTitle;
    }

    function hasImgRole(s) {
      let hasImgRole = s.getAttribute("role") === "img";
      log("Has role=img: " + !!hasImgRole);
      return !!hasImgRole;
    }

    function hasAriaLabel(s) {
      let ariaLabel = s.ariaLabel || s.getAttribute("aria-label");
      let hasAriaLabel = !!ariaLabel;
      log("Has aria-label: " + hasAriaLabel);
      return !!hasAriaLabel;
    }

    function hasAriaLabelledby(s) {
      let ariaLabelledbyId = s.ariaLabelledby || s.getAttribute("aria-labelledby");
      let hasAriaLabelledby = !!ariaLabelledbyId;
      log("Has aria-labelledby: " + hasAriaLabelledby);
      return !!hasAriaLabelledby;
    }

    log("Checking if inline svg is accessible");

    let isAccessible = false;
    const svgId = !!svg.id ? svg.id : "[unspecified]";
    log("id: " + svgId);

    isAccessible = !!(hasTitle(svg) && !!hasImgRole(svg));
    isAccessible = isAccessible || !!hasAriaLabel(svg);
    isAccessible = isAccessible || !!hasAriaLabelledby(svg);
    // TODO: Any other ways for an svg to be accessible?
    isAccessible = isAccessible || isElementHidden(svg);
    log("svg is accessible: " + isAccessible);
    outputA11yResults(svg, isAccessible);

    log("------------------------");
  }

  // Get all imgs and svgs in top-level and nested shadowRoots.
  function findAndTestShadowImages() {
    function findNestedShadowRoots(sr, i) {
      i = i + 1 || 1;
      const nodes = sr.querySelectorAll("*");
      for (const node of nodes) {
        const shadowChild = node.shadowRoot;
        if (shadowChild) {
          log(
            "Found a shadow child (nesting level " +
              i +
              "): " +
              shadowChild.lastElementChild.localName
          );
          const shadowHtml = shadowChild.innerHTML;
          let hasHidden = shadowHtml.toLowerCase().includes("aria-hidden");
          log("HIDDEN: " + hasHidden);
          let hasContactSvg = shadowHtml.toLowerCase().includes("bubble");
          if (hasContactSvg) {
            log("+++\n+++\nCONTACT: " + hasContactSvg + "\n+++\n+++");

            // Get all svgs in nested shadowRoot
            const svgs = shadowChild.querySelectorAll("svg");
            for (const svg of svgs) {
              log("Found svg in level " + i + " shadowRoot");
              checkSvgA11y(svg);
            }
          }

          // Keep checking for more nesting levels.
          findNestedShadowRoots(shadowChild, i);
        }
      }
    }

    // Get all elements on page and then check to see if they have shadowRoots
    const nodes = document.querySelectorAll("*");
    for (const node of nodes) {
      const shadowNode = node.shadowRoot;
      if (shadowNode) {
        log("------------------------");
        log("Found a shadowRoot: " + shadowNode.lastElementChild.localName);
        dir(shadowNode);
        const shadowHtml = shadowNode.innerHTML;
        let hasHidden = !!shadowNode.getRootNode().host.ariaHidden;
        log("HIDDEN: " + hasHidden);
        log(shadowNode.getRootNode().nodeName);
        let hasContactSvg = shadowHtml.toLowerCase().includes("bubble");
        if (hasContactSvg) {
          log("+++\n+++\nCONTACT: " + hasContactSvg + "\n+++\n+++");

          // Get all svgs in top-level shadowRoot
          const svgs = node.shadowRoot.querySelectorAll("svg");
          for (const svg of svgs) {
            log("Found svg in top-level shadowRoot");
            checkSvgA11y(svg);
          }
        }

        findNestedShadowRoots(shadowNode);
      }
    }
  }

  (function init() {
    log("Initiating image test bookmarklet.");
    log("------------------------");
    findAndTestShadowImages();
  })();
})();
