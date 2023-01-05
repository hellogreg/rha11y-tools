javascript: (() => {
  // Give log() the ability to include line numbers.
  // const log = console.log.bind(window.console);

  const outputMessagesDefault = true;
  let outputMessages = outputMessagesDefault;

  function log(m) {
    if (outputMessages) {
      m = m !== undefined ? m : "--------------------";
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

  // Test all the ways elements can be hidden from assistive tech.
  function isElementHidden(element) {
    function isHidden(el) {
      let hid;
      log("Checking if " + el.nodeName + " is hidden");

      // Check for hidden attribute
      hid = hid || !!el.hidden;

      if (el.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        // If shadowRoot element, checks element and host for ariaHidden
        log("Running isHidden tests for shadow element...");

        let isAriaHidden = !!el.ariaHidden;
        hid = hid || isAriaHidden;
        log("aria-hidden: " + isAriaHidden);

        let isHostAriaHidden = !!el.getRootNode().host.ariaHidden;
        hid = hid || isHostAriaHidden;
        log("getRootNode().host.ariaHidden: " + isHostAriaHidden);
      } else {
        // If _not_ shadowRoot element, checks element for various ways to be hidden form AT
        log("Running isHidden tests for non-shadow element...");

        let isAriaHidden = !!el.ariaHidden || el.getAttribute("aria-hidden") === "true";
        hid = hid || isAriaHidden;
        log("aria-hidden: " + isAriaHidden);

        let hasRolePresentation = el.getAttribute("role") === "presentation";
        hid = hid || hasRolePresentation;
        log("role=presentation: " + hasRolePresentation);

        let hasDisplayNone = getComputedStyle(el).display === "none";
        hid = hid || hasDisplayNone;
        log("display:none: " + hasDisplayNone);
      }

      // TODO: Any other ways it could be hidden?

      return !!hid;
    }

    // Test if any of the element's parent elements are hidden, thus hiding the element
    function areAnyParentsHidden(el) {
      let hid;
      let parent = el.parentNode;
      while (!hid && parent && parent.nodeName !== "BODY" && parent.nodeName) {
        log("Parent:");
        console.dir(parent);
        hid = hid || isHidden(parent);
        parent = parent.parentNode;
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

  // Test if an image is accessible (has alt or is hidden)
  function checkImgA11y(img) {
    log("Checking if image is accessible");

    let imgSrc = !!img.src ? img.src : "[unspecified]";
    const imgId = !!img.id ? img.id : "[unspecified]";
    log("src: " + imgSrc);
    log("id: " + imgId);

    let isAccessible = !!(hasAltAttribute(img) || isElementHidden(img));
    log("Image is accessible: " + isAccessible);
    outputA11yResults(img, isAccessible);

    log();
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
      if (hasAriaLabel) {
        log("aria-label: " + ariaLabel);
      }

      return !!hasAriaLabel;
    }

    function hasAriaLabelledby(s) {
      function getAriaLabelledbyValue(id) {
        let value = "";

        // See if the aria-labelledby element is within the SVG itself.
        value = value || s.getElementById(id) ? s.getElementById(id).textContent : null;

        // See if the aria-labelledby element is elsewhere in the page (excepting shadoRoots).
        value =
          value || document.getElementById(id) ? document.getElementById(id).textContent : null;

        // TODO: See if the aria-labelledby element is in a shadowRoot somewhere.

        return value;
      }

      let ariaLabelledbyId = s.ariaLabelledby || s.getAttribute("aria-labelledby");
      let hasAriaLabelledby = !!ariaLabelledbyId;
      log("Has aria-labelledby: " + hasAriaLabelledby);

      let ariaLabelledbyValue;
      let hasAriaLabelledbyValue = null;

      // Get the label value if the element has aria-labelledby attribute.
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

    log();
  }

  // Fade out background images to indicate they are not tested
  function fadeBackgroundImages() {
    const nodes = document.querySelectorAll("*");
    for (const node of nodes) {
      // Only fade images with a url, and not just colors/gradients
      if (node.style.backgroundImage.match("url") || node.style.background.match("url")) {
        log("Background image found. They are not tested.");
        // let bgImage = node.style.backgroundImage;
        //node.style.setProperty("background-image", "none");
        node.style.setProperty("background-color", "#fffd");
        node.style.setProperty("background-blend-mode", "color");
      }
    }
  }

  function findAndTestNonShadowImages() {
    // Get all non-shadow svgs
    const svgs = document.querySelectorAll("svg");
    for (const svg of svgs) {
      checkSvgA11y(svg);
    }

    // Get all non-shadow imgs
    const imgs = document.querySelectorAll("img");
    for (const img of imgs) {
      checkImgA11y(img);
    }
  }

  // Get all imgs and svgs in top-level and nested shadowRoots.
  function findAndTestShadowImages() {
    function findNestedShadowRoots(sr, i) {
      i = i + 1 || 1;
      const nodes = sr.querySelectorAll("*");
      for (const node of nodes) {
        const shadowChild = node.shadowRoot;
        if (shadowChild) {
          log();
          log(
            "Found a shadow child (nesting level " +
              i +
              "): " +
              shadowChild.lastElementChild.localName
          );

          // Get all svgs in nested shadowRoot
          const svgs = shadowChild.querySelectorAll("svg");
          for (const svg of svgs) {
            log("Found svg in level " + i + " shadowRoot");
            checkSvgA11y(svg);
          }

          // Get all imgs in nested shadowRoot
          const imgs = shadowChild.querySelectorAll("img");
          for (const img of imgs) {
            log("Found img in level " + i + " shadowRoot");
            checkImgA11y(img);
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
        log();
        log("Found a shadowRoot: " + shadowNode.lastElementChild.localName);
        let hasContactSvg = shadowNode.innerHTML.toLowerCase().includes("bubble");
        if (hasContactSvg) {
          log("+++\n+++\nCONTACT: " + hasContactSvg + "\n+++\n+++");
        }

        // Get all svgs in top-level shadowRoot
        const svgs = node.shadowRoot.querySelectorAll("svg");
        for (const svg of svgs) {
          log("Found svg in top-level shadowRoot");
          checkSvgA11y(svg);
        }

        // Get all imgs in top-level shadowRoot
        const imgs = shadowNode.querySelectorAll("img");
        for (const img of imgs) {
          log("Found img in top-level shadowRoot");
          checkImgA11y(img);
        }

        findNestedShadowRoots(shadowNode);
      }
    }
  }

  (function init() {
    log("Initiating image test bookmarklet.");
    log();
    findAndTestNonShadowImages();
    findAndTestShadowImages();
    fadeBackgroundImages();
  })();
})();
