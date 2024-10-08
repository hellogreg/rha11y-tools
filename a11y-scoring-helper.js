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

  ///
  /// OUTPUT PAGE INFO
  ///

  function getDocumentInfo() {
    // 1) Get page title
    const pageTitle = document.title;
    const hasPageTitle = !!pageTitle;
    log(`Page has title: ${hasPageTitle}`);
    log(`Page title: ${pageTitle}`);

    // 2) Get page language
    const pageLang = document.documentElement.lang;
    const hasPageLang = !!pageLang;
    log(`Page has language specified: ${hasPageLang}`);
    log(`Page language: ${pageLang}`);

    return {
      pageTitle: pageTitle,
      hasPageTitle: hasPageTitle,
      pageLang: pageLang,
      hasPageLang: hasPageLang
    };
  }

  function outputResults(info) {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    let h2, h3, ul, li, p;
    const pageTitle = info.pageTitle;
    const hasPageTitle = info.hasPageTitle;
    const pageLang = info.pageLang;
    const hasPageLang = info.hasPageLang;

    h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode("Page info"));
    dialog.appendChild(h2);

    p = document.createElement("p");
    p.style.fontStyle = "italic";
    p.appendChild(document.createTextNode("Press [esc] or refresh the page to close this window."));
    dialog.appendChild(p);

    h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode("Title"));
    dialog.appendChild(h3);

    ul = document.createElement("ul");
    ul.style.marginBottom = "2rem";
    li = document.createElement("li");
    li.appendChild(document.createTextNode("Title present: " + hasPageTitle));
    ul.appendChild(li);
    if (!!hasPageTitle) {
      li = document.createElement("li");
      li.appendChild(document.createTextNode("Page title: " + pageTitle));
      ul.appendChild(li);
    }
    dialog.appendChild(ul);

    h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode("Language"));
    dialog.appendChild(h3);

    ul = document.createElement("ul");
    ul.style.marginBottom = "2rem";
    li = document.createElement("li");
    li.appendChild(document.createTextNode("Language specified: " + hasPageLang));
    ul.appendChild(li);
    if (!!hasPageLang) {
      li = document.createElement("li");
      li.appendChild(document.createTextNode("Page language: " + pageLang));
      ul.appendChild(li);
    }
    dialog.appendChild(ul);

    p = document.createElement("p");
    p.appendChild(document.createTextNode(" "));
    dialog.appendChild(p);
    p = document.createElement("p");
    p.style.fontStyle = "italic";
    p.appendChild(document.createTextNode("Press [esc] or refresh the page to close this window."));
    dialog.appendChild(p);

    dialog.showModal();
  }

  ///
  /// GET ALL ELEMENTS
  ///

  // Returns an element we can use, whether shadow DOM or not
  function getUsableElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

  function getAllElements(root) {
    function getElements(root) {
      const nodes = root.querySelectorAll("*");

      for (const node of nodes) {
        const element = getUsableElement(node);

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

  /// HIGHLIGHT ALL LINKS

  function isHtmlElementDisplayNone(element) {
    // List from here: https://www.w3.org/TR/2014/REC-html5-20141028/rendering.html#hidden-elements
    const displayNoneElements = [
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
    let isDisplayNone = displayNoneElements.includes(element.tagName.toLowerCase());
    return isDisplayNone;
  }

  function getExplicitRole(element) {
    const explicitRole = element.role || element.getAttribute("role") || undefined;
    return explicitRole;
  }

  function isImplicitLink(element) {
    return element.nodeName.toLowerCase() === "a" && !!element.href;
  }

  function isExplicitLink(element) {
    const explicitRole = getExplicitRole(element);
    return explicitRole && explicitRole === "link";
  }

  function isLink(element) {
    if (isExplicitLink(element)) {
      log("Found link: explicit");
      return true;
    } else if (isImplicitLink(element) && !getExplicitRole(element)) {
      log("Found link: implicit");
      return true;
    }
    return false;
  }

  function highlightLinks(elements) {
    for (let element of elements) {
      // Ignore the display:none elements...
      if (!isHtmlElementDisplayNone(element) && isLink(element)) {
        // Outline the link
        const outlineColor = "#09fd";
        element.style.setProperty("outline", outlineColor + " dotted 4px", "important");
        element.style.setProperty("outline-offset", "2px", "important");
        element.style.setProperty("border-radius", "2px", "important");
        element.style.setProperty("filter", "initial", "important");
      }
    }
  }

  function isImplicitButton(element) {
    if (element.nodeName.toLowerCase() === "button") {
      return true;
    } else if (element.nodeName.toLowerCase() === "input" && element.type === "button") {
      return true;
    }
    return false;
  }

  function isExplicitButton(element) {
    const explicitRole = getExplicitRole(element);
    return explicitRole && explicitRole === "button";
  }

  function isButton(element) {
    if (isExplicitButton(element)) {
      log("Found button: explicit");
      return true;
    } else if (isImplicitButton(element) && !getExplicitRole(element)) {
      log("Found button: implicit");
      return true;
    }
    return false;
  }

  function highlightButtons(elements) {
    for (let element of elements) {
      // Ignore the display:none elements...
      if (!isHtmlElementDisplayNone(element) && isButton(element)) {
        // Outline the button
        const outlineColor = "#f90d";
        element.style.setProperty("outline", outlineColor + " dashed 4px", "important");
        element.style.setProperty("outline-offset", "2px", "important");
        element.style.setProperty("border-radius", "2px", "important");
        element.style.setProperty("filter", "initial", "important");
      }
    }
  }

  (function init() {
    log();

    // Output page info, like title and language.
    const pageInfo = getDocumentInfo();
    outputResults(pageInfo);

    // Get all elements (light and shadow) for other functions.
    const elements = getAllElements(document.body);

    highlightLinks(elements);
    highlightButtons(elements);

    log();
  })();
})();
