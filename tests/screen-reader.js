// TODO: Don't REMOVE() items. Hide them, in case they need to return
// - Except maybe for images!
// - e.g., add a class to all aria-hidden items. remove it when they are no longer hidden
//
// CSS can influence screen readers: https://benmyers.dev/blog/css-can-influence-screenreaders/

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

  function isImg(element) {
    return element.nodeName.toLowerCase() === "img";
  }

  function isSvg(element) {
    return element.nodeName.toLowerCase() === "svg";
  }

  function hasShadowRoot(node) {
    return !!node.shadowRoot;
  }

  // Returns an element we can use, whether shadow DOM or not
  function getUsableElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

  // Test all the ways an element can be hidden from assistive tech.
  function isElementHidden(element) {
    let isHidden = false;
    //element = getUsableElement(element);

    // Check for hidden attribute
    const hasHiddenAttr = !!element.hidden;
    isHidden = isHidden || hasHiddenAttr;

    const hasDisplayNone = getComputedStyle(element).display === "none";
    isHidden = isHidden || hasDisplayNone;

    const hasVisibilityHidden = getComputedStyle(element).visibility === "hidden";
    isHidden = isHidden || hasVisibilityHidden;

    const isAriaHidden = !!element.ariaHidden || element.getAttribute("aria-hidden") === "true";
    isHidden = isHidden || isAriaHidden;

    const hasRolePresentation = element.getAttribute("role") === "presentation";
    if (hasRolePresentation && element.childNodes.length === 0) {
      isHidden = isHidden || hasRolePresentation;
    } else if (hasRolePresentation) {
      // TODO: How to handle role="presentation" on elements with children, so
      // the element is hidden, but the children are not.
      log(`${element} element has role='presentation' and child nodes.`);
    }

    // TODO: Any other ways it could be hidden?

    return !!isHidden;
  }

  // Test whether an <img> element has an alt attribute, even if it's null
  function getAltAttribute(img) {
    const hasAlt = !!img.hasAttribute("alt");
    let altValue = false;
    if (hasAlt) {
      altValue = img.getAttribute("alt") || "DECORATIVE";
    }
    return altValue;
  }

  // Test whether an element has role="img"
  function hasImgRole(element) {
    const hasImgRole = element.getAttribute("role") === "img";
    return !!hasImgRole;
  }

  // Test whether an <svg> element has a <title> as its first child element
  function getTitleValue(svg) {
    let titleValue = false;
    if (svg.firstElementChild.tagName === "title") {
      titleValue = svg.firstElementChild.textContent || false;
    }
    return titleValue;
  }

  // Test whether an element has an aria-label
  function getAriaLabelValue(element) {
    const ariaLabelValue = element.ariaLabel || element.getAttribute("aria-label") || false;
    return ariaLabelValue;
  }

  // Get an element's aria-labelledby value from its target
  function getAriaLabelledbyValue(element) {
    const ariaLabelledbyId = element.ariaLabelledby || element.getAttribute("aria-labelledby");
    let ariaLabelledbyValue = false;

    if (!!ariaLabelledbyId) {
      let labelTarget = document.getElementById(ariaLabelledbyId);
      ariaLabelledbyValue = labelTarget ? labelTarget.textContent.trim() : false;
    }

    // TODO: We're currently returning true if there's an aria-labelledby attribute at all.
    // But we should check to make sure it has a valid id and value.
    // Once hasAriaLabelledbyValue() can check shadowRoots, use the following:
    // return !!hasAriaLabelledbyValue;
    // But for now, we're using this:
    return ariaLabelledbyValue;
  }

  // Test if an image is accessible (has alt or is hidden)
  // TODO: aria-label and aria-lbelledby would also be okay.
  //
  function replaceImg(img) {
    let isAccessible = false;
    let imageMessage = "[INACCESSIBLE IMAGE]";

    const altValue = getAltAttribute(img);
    if (!!altValue) {
      isAccessible = true;
      imageMessage = `[IMAGE: ${altValue}]`;
    }

    removeHiddenElement(img, imageMessage);
  }

  // Test if an svg is accessible (has an accessible name/role or is hidden)
  //
  function replaceSvg(svg) {
    let isAccessible = false;
    let svgMessage = "[INACCESSIBLE SVG]";

    // Check if the SVG has an accessible name...
    hasImgRole(svg); // TODO: Will we start requiring?

    const titleValue = getTitleValue(svg);
    if (!!titleValue) {
      isAccessible = true;
      svgMessage = `[IMAGE: ${titleValue}]`;
    }

    const ariaLabelledbyValue = getAriaLabelledbyValue(svg);
    if (!!ariaLabelledbyValue) {
      isAccessible = true;
      svgMessage = `[IMAGE: ${ariaLabelledbyValue}]`;
    }

    const ariaLabelValue = getAriaLabelValue(svg);
    if (!!ariaLabelValue) {
      isAccessible = true;
      svgMessage = `[IMAGE: ${ariaLabelValue}]`;
    }

    // TODO: Any other ways for an svg to be accessible? <text> without role="img"?

    removeHiddenElement(svg, svgMessage);
  }

  function removeHiddenElement(element, message) {
    if (element) {
      if (message) {
        const span = document.createElement("span");
        span.classList.add("new-screen-reader-content");
        span.innerHTML = message;
        element.parentNode.insertBefore(span, element.nextSibling);
      }
      //element.remove();
      element.classList.add("hide-everywhere");
    }
  }

  // Fade out background images to indicate they are not tested
  //
  function cleanDefaultStyles(element) {
    if (element.style) {
      //element.style.setProperty("all", "unset");
      element.style.setProperty("background-image", "none");
      element.style.setProperty("background", "none");
      element.style.setProperty("color", "revert");
      element.style.setProperty("background-color", "revert");
      element.style.setProperty("font", "revert");
      element.style.setProperty("font-family", "system-ui, -apple-system, sans-serif");
      element.style.setProperty("line-height", "1.4");
    }
  }

  // We don't want/need to remove HTML elements that are display:none by default.
  function isHtmlElementDisplayNone(element) {
    // List from here: https://www.w3.org/TR/2014/REC-html5-20141028/rendering.html#hidden-elements
    const DisplayNoneElements = [
      "area",
      "base",
      "basefont",
      "datalist",
      "head",
      "link",
      "meta",
      "noembed",
      "noframes",
      "noscript",
      "param",
      "rp",
      "script",
      "source",
      "style",
      "template",
      "track",
      "title"
    ];
    let isDisplayNone = DisplayNoneElements.includes(element.tagName.toLowerCase());
    return isDisplayNone;
  }

  function convertContent(elements) {
    log("Cleaning body styles...");
    cleanDefaultStyles(document.body);

    for (let element of elements) {
      element = getUsableElement(element);

      if (!isHtmlElementDisplayNone(element)) {
        if (isElementHidden(element)) {
          removeHiddenElement(element, "[REMOVED HIDDEN ELEMENT]");
        } else {
          if (isImg(element)) {
            replaceImg(element);
          }

          if (isSvg(element)) {
            replaceSvg(element);
          }

          cleanDefaultStyles(element);
        }
      }
    }
  }

  // If this isn't the first time we've run this app, restore the original state.
  function refreshApp(elements) {
    for (let element of elements) {
      element = getUsableElement(element);

      // Get rid of newly-added elements
      if (element.classList.contains("new-screen-reader-content")) {
        element.remove();
      }

      // Restore hidden elements
      element.classList.remove("hide-everywhere");
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

  function addStylesheet(href) {
    const head = document.head;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    head.appendChild(link);
  }

  (function init() {
    addStylesheet("screen-reader.css?v=1");
    group("rha11y-screen-reader results");
    // By default, get all elements in the document body.
    const elements = getAllElements(document.body);
    refreshApp(elements);
    convertContent(elements);
    groupEnd();
  })();
})();
