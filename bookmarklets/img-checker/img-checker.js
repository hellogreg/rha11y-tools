javascript: (() => {
  //
  // Resources:
  // alt decision tree: https://www.w3.org/WAI/tutorials/images/decision-tree/
  // Access lit components with renderRoot? https://lit.dev/docs/components/shadow-dom/
  // JS minifier for creating quick local bookmarklet: https://www.toptal.com/developers/javascript-minifier
  //
  // TODO: Determine if parents of shadowroots are hidden.
  // TODO: Why aren't some images identified (e.g., search at redhat.com)?
  // TODO: Fix outline color for some images (e.g., globe in redhat.com footer).
  // TODO: Better to identify by img tag or document.querySelectorAll([(role = "img")])?
  //

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

  function outputA11yResults(element, accessible) {
    let color = "#eee";
    if (accessible) {
      color = "#09f";
    } else {
      color = "#f90";
    }
    element.style.setProperty("outline", color + " solid 8px", "important");

    // Add a data-a11y attribute to the element.
    // This attribute lists test results for someone inspecting the element.
    // TODO: Add more detail to the results.
    element.setAttribute("data-a11y", "Accessible: " + !!accessible);
  }

  function hasAltAttribute(img) {
    hasAlt = img.hasAttribute("alt");
    log("Has alt attribute: " + hasAlt);
    if (hasAlt) {
      const altValue = img.getAttribute("alt") || "[decorative]";
      log("Image alt value: " + altValue);
    }
    return hasAlt;
  }

  // Test all ways elements can be hidden from assistive tech...
  function isElementHidden(element) {
    function isHidden(el) {
      let hid;
      log("Checking if " + el.nodeName + " is hidden");

      // We use try/catch blocks because web components may fail to execute tests.

      // Check for hidden attribute
      hid = hid || !!el.hidden;

      // Check for aria-hidden="true" and role="presentation"
      // Uses Firefox getAttribute() workaround for ariaHidden
      try {
        hid = hid || el.ariaHidden || el.getAttribute("aria-hidden") === "true";
      } catch (e) {
        hid = hid || el.ariaHidden;
        log("Can't test " + el.nodeName + " for aria-hidden attribute.");
      }

      // Check for role="presentation"
      try {
        hid = hid || el.getAttribute("role") === "presentation";
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

    function areAnyParentsHidden(el) {
      let hid;
      let parent = el.parentNode;
      // To test for web component parent: parent.nodeType !== 11 {
      while (!hid && parent && parent.nodeName !== "BODY" && parent.nodeName) {
        hid = hid || isHidden(parent);
        parent = parent.parentNode;
      }

      return hid;
    }

    log("Checking if element is hidden");
    let hidden = isHidden(element);
    log("Image hidden from AT: " + !!hidden);

    if (!hidden) {
      log("Checking if any parents are hidden");
      hidden = hidden || areAnyParentsHidden(element);
    }

    log("Element or parent is hidden: " + hidden);
    return !!hidden;
  }

  function checkImgA11y(img) {
    log("Checking if image is accessible");

    let imgSrc = !!img.src ? img.src : "[unspecified]";
    let imgId = !!img.id ? img.id : "[unspecified]";
    log("src: " + imgSrc);
    log("id: " + imgId);
    //dir(img);

    let isAccessible = !!(hasAltAttribute(img) || isElementHidden(img));
    log("image is accessible: " + isAccessible);
    outputA11yResults(img, isAccessible);

    log();
  }

  function checkSvgA11y(svg) {
    function hasTitle(s) {
      let title = s.querySelector("svg > title");
      let hasTitle = title && title.textContent;
      log("Has <title>: " + !!hasTitle);
      let titleText = hasTitle ? svg.querySelector("svg > title").textContent : "[unspecified]";
      log("title: " + titleText);
      return !!hasTitle;
    }

    function hasRoleImg(s) {
      let hasRoleImg = s.getAttribute("role") === "img";
      log("Has role='img': " + !!hasRoleImg);
      return !!hasRoleImg;
    }

    log("Checking if inline svg is accessible");

    let svgId = !!svg.id ? svg.id : "[unspecified]";

    let isAccessible = !!(hasTitle(svg) && hasRoleImg(svg));
    // TODO: check other ways to name svg: e.g., aria-label:
    // isAccessible = isAccessible || !!hasAriaLabel(svg);
    isAccessible = isAccessible || isElementHidden(svg);
    log("svg is accessible: " + isAccessible);
    outputA11yResults(svg, isAccessible);

    log();
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

  // Get every img and svg that's in a shadowRoot.
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

          const svgs = shadowChild.querySelectorAll("svg");
          for (const svg of svgs) {
            log("Found svg in level " + i + " shadowRoot");
            checkImgA11y(svg);
          }

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

    const nodes = document.querySelectorAll("*");
    for (const node of nodes) {
      const shadowNode = node.shadowRoot;
      if (shadowNode) {
        log("Found a top-level shadowRoot: " + shadowNode.lastElementChild.localName);
        findNestedShadowRoots(shadowNode);

        // Get all shadow svgs
        const svgs = node.shadowRoot.querySelectorAll("svg");
        for (const svg of svgs) {
          log("Found svg in top-level shadowRoot");
          checkSvgA11y(svg);
        }

        // Get all shadow imgs
        const imgs = shadowNode.querySelectorAll("img");
        for (const img of imgs) {
          log("Found img in top-level shadowRoot");
          checkImgA11y(img);
        }
      }
    }
  }

  (function init() {
    setTimeout(() => {
      log("Initiating image test bookmarklet.");
      log();
      findAndTestNonShadowImages();
      findAndTestShadowImages();
    }, 0); // Can set delay in testing
  })();
})();
