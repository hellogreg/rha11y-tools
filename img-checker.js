javascript: (() => {
  // Give log() the ability to include line numbers.
  const log = console.log.bind(window.console);

  /*
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
  */

  // Display the test results: outline around image and data-a11y attribute in element
  function outputA11yResults(element, accessible) {
    const colorPass = "#09f";
    const colorFail = "#f90";
    let outlineColor = !!accessible ? colorPass : colorFail;
    element.style.setProperty("outline", outlineColor + " solid 4px", "important");
    element.style.setProperty("border", "4px solid " + outlineColor, "important");

    // Remove any current filters on the element, because they affect outline color, too.
    element.style.setProperty("filter", "initial", "important");

    // TODO: We can use border for images that are in containers that block outlines visibility.
    // However, unlike outline, border will affect layout by a few pixels per image.
    // element.style.setProperty("border", "2px solid " + outlineColor, "important");

    // TODO: maybe use filters to indicate pass/fail when outlines arent' visible?
    // let filter = !!accessible ? "grayscale(100%)" : "sepia(100%)";
    // element.style.setProperty("filter", filter, "important");

    // Add a data-a11y attribute to the element.
    // This attribute lists test results for someone inspecting the element.
    // TODO: Add more detail to the results.
    element.setAttribute("data-a11y", "Accessible: " + !!accessible);
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

      // TODO: Any other ways it could be hidden?

      return !!hid;
    }

    // Test if any of the element's parent elements are hidden, thus hiding the element
    function areAnyParentsHidden(el) {
      let hid;
      let parent = el.parentNode;
      // To test for web component parent: parent.nodeType !== 11 {
      while (!hid && parent && parent.nodeName !== "BODY" && parent.nodeName) {
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

    log("------------------------");
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

    log("------------------------");
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
            checkImgA11y(svg);
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
        log("Found a top-level shadowRoot: " + shadowNode.lastElementChild.localName);
        findNestedShadowRoots(shadowNode);

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
      }
    }
  }

  (function init() {
    log("Initiating image test bookmarklet.");
    log("------------------------");
    findAndTestNonShadowImages();
    findAndTestShadowImages();
  })();
})();
