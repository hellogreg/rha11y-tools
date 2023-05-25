// W3C Role mappings:
// https://www.w3.org/TR/html-aam-1.0/#html-element-role-mappings

javascript: (() => {
  // Custom log(), dir(), group(), and groupEnd() functions, so we don't have to prepend with console
  //
  function log(m, s) {
    m = m !== undefined ? m : " ";
    if (s) {
      console.log(m, s);
    } else {
      console.log(m);
    }
  }

  function dir(m) {
    console.dir(m);
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

  // Returns an element we can use, whether shadow DOM or not
  function getUsableElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

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

  const selectorsAndRoles = [
    { selector: "a", role: "generic", specificity: "001" },
    { selector: "a[href]", role: "link", specificity: "011" },
    { selector: "abbr", role: null, specificity: "001" },
    { selector: "address", role: "group", specificity: "001" },
    { selector: "area", role: "generic", specificity: "001" },
    { selector: "area[href]", role: "link", specificity: "011" },
    { selector: "article", role: "article", specificity: "001" },
    { selector: "aside", role: "complementary", specificity: "001" },
    {
      selector: "article aside, aside aside, nav aside, section aside",
      role: "generic",
      specificity: "002"
    },
    { selector: "audio", role: null, specificity: "001" },
    { selector: "b", role: "generic", specificity: "001" },
    { selector: "base", role: null, specificity: "001" },
    { selector: "bdi", role: "generic", specificity: "001" },
    { selector: "bdo", role: "generic", specificity: "001" },
    { selector: "blockquote", role: "blockquote", specificity: "001" },
    { selector: "body", role: "generic", specificity: "001" },
    { selector: "br", role: null, specificity: "001" },
    { selector: "button", role: "button", specificity: "001" },
    { selector: "canvas", role: null, specificity: "001" },
    { selector: "caption", role: "caption", specificity: "001" },
    { selector: "cite", role: null, specificity: "001" },
    { selector: "code", role: "code", specificity: "001" },
    { selector: "col", role: null, specificity: "001" },
    { selector: "colgroup", role: null, specificity: "001" },
    { selector: "data", role: "genric", specificity: "001" },
    { selector: "datalist", role: "listbox", specificity: "001" },
    { selector: "dd", role: "definition", specificity: "001" },
    { selector: "del", role: "deletion", specificity: "001" },
    { selector: "details", role: "group", specificity: "001" },
    { selector: "dfn", role: "generic", specificity: "001" },
    { selector: "dialog", role: "dialog", specificity: "001" },
    { selector: "div", role: "generic", specificity: "001" },
    { selector: "dl", role: null, specificity: "001" },
    { selector: "dt", role: "term", specificity: "001" },
    { selector: "em", role: "emphasis", specificity: "001" },
    { selector: "embed", role: null, specificity: "001" },
    { selector: "fieldset", role: "group", specificity: "001" },
    { selector: "figcaption", role: null, specificity: "001" },
    { selector: "figure", role: "figure", specificity: "001" },
    { selector: "footer", role: "contentinfo", specificity: "001" },
    {
      selector: "main footer, article footer, aside footer, nav footer, section footer",
      role: "generic",
      specificity: "002"
    },
    { selector: "form", role: "form", specificity: "001" },
    { selector: "h1", role: "heading", specificity: "001" },
    { selector: "h2", role: "heading", specificity: "001" },
    { selector: "h3", role: "heading", specificity: "001" },
    { selector: "h4", role: "heading", specificity: "001" },
    { selector: "h5", role: "heading", specificity: "001" },
    { selector: "h6", role: "heading", specificity: "001" },
    { selector: "head", role: null, specificity: "001" },
    { selector: "header", role: "banner", specificity: "001" },
    {
      selector: "main header, article header, aside header, nav header, section header",
      role: "generic",
      specificity: "002"
    },
    { selector: "hgroup", role: "group", specificity: "001" },
    { selector: "hr", role: "separator", specificity: "001" },
    { selector: "html", role: "document", specificity: "001" },
    { selector: "i", role: "generic", specificity: "001" },
    { selector: "iframe", role: null, specificity: "001" },
    { selector: "img", role: "img", specificity: "001" },
    { selector: "img[alt='']", role: "presentation", specificity: "002" },
    { selector: "input", role: "textbox", specificity: "001" },
    { selector: "input[type='button']", role: "button", specificity: "011" },
    { selector: "input[type='checkbox']", role: "checkbox", specificity: "011" },
    { selector: "input[type='color']", role: null, specificity: "011" },
    { selector: "input[type='date']", role: null, specificity: "011" },
    { selector: "input[type='datetime-local']", role: null, specificity: "011" },
    { selector: "input[type='email']", role: "textbox", specificity: "011" },
    { selector: "input[type='file']", role: null, specificity: "011" },
    { selector: "input[type='hidden']", role: null, specificity: "011" },
    { selector: "input[type='image']", role: "button", specificity: "011" },
    { selector: "input[type='month']", role: null, specificity: "011" },
    { selector: "input[type='number']", role: "spinbutton", specificity: "011" },
    { selector: "input[type='password']", role: null, specificity: "011" },
    { selector: "input[type='radio']", role: "radio", specificity: "011" },
    { selector: "input[type='range']", role: "slider", specificity: "011" },
    { selector: "input[type='reset']", role: "button", specificity: "011" },
    { selector: "input[type='search']", role: "search", specificity: "011" },
    { selector: "input[type='submit']", role: "button", specificity: "011" },
    { selector: "input[type='tel']", role: "textbox", specificity: "011" },
    { selector: "input[type='text']", role: "textbox", specificity: "011" },
    { selector: "input[type='time']", role: null, specificity: "011" },
    { selector: "input[type='url']", role: "textbox", specificity: "011" },
    { selector: "input[type='week']", role: null, specificity: "011" },
    { selector: "ins", role: "insertion", specificity: "001" },
    { selector: "kbd", role: null, specificity: "001" },
    { selector: "label", role: null, specificity: "001" },
    { selector: "legend", role: null, specificity: "001" },
    { selector: "li", role: "listitem", specificity: "001" },
    { selector: "link", role: null, specificity: "001" },
    { selector: "main", role: "main", specificity: "001" },
    { selector: "map", role: null, specificity: "001" },
    { selector: "mark", role: "mark", specificity: "001" },
    { selector: "math", role: "math", specificity: "001" },
    { selector: "menu", role: "list", specificity: "001" },
    { selector: "meta", role: null, specificity: "001" },
    { selector: "meter", role: "meter", specificity: "001" },
    { selector: "nav", role: "navigation", specificity: "001" },
    { selector: "noscript", role: null, specificity: "001" },
    { selector: "object", role: null, specificity: "001" },
    { selector: "ol", role: "list", specificity: "001" },
    { selector: "optgroup", role: "group", specificity: "001" },
    { selector: "option", role: "option", specificity: "001" },
    { selector: "output", role: "status", specificity: "001" },
    { selector: "p", role: "paragraph", specificity: "001" },
    { selector: "param", role: null, specificity: "001" },
    { selector: "picture", role: null, specificity: "001" },
    { selector: "pre", role: "generic", specificity: "001" },
    { selector: "progress", role: "progressbar", specificity: "001" },
    { selector: "q", role: "generic", specificity: "001" },
    { selector: "rp", role: null, specificity: "001" },
    { selector: "rt", role: null, specificity: "001" },
    { selector: "ruby", role: null, specificity: "001" },
    { selector: "s", role: "deletion", specificity: "001" },
    { selector: "samp", role: "generic", specificity: "001" },
    { selector: "script", role: null, specificity: "001" },
    { selector: "search", role: "search", specificity: "001" },
    { selector: "section", role: "generic", specificity: "001" },
    { selector: "select", role: "combobox", specificity: "001" },
    { selector: "select[size]", role: "listbox", specificity: "011" },
    { selector: "select[size='0']", role: "combobox", specificity: "011" },
    { selector: "select[size='1']", role: "combobox", specificity: "011" },
    { selector: "select[multiple]", role: "listbox", specificity: "011" },
    { selector: "slot", role: null, specificity: "001" },
    { selector: "small", role: "generic", specificity: "001" },
    { selector: "source", role: null, specificity: "001" },
    { selector: "span", role: "generic", specificity: "001" },
    { selector: "strong", role: "strong", specificity: "001" },
    { selector: "style", role: null, specificity: "001" },
    { selector: "sub", role: "subscript", specificity: "001" },
    { selector: "summary", role: null, specificity: "001" },
    { selector: "sup", role: "superscript", specificity: "001" },
    { selector: "svg", role: null, specificity: "001" },
    { selector: "table", role: "table", specificity: "001" },
    { selector: "tbody", role: "rowgroup", specificity: "001" },
    { selector: "td", role: "cell", specificity: "001" },
    {
      selector: "table[role='grid'] td, table[role='treegrid'] td",
      role: "gridcell",
      specificity: "011"
    },
    { selector: "template", role: null, specificity: "001" },
    { selector: "textarea", role: "textarea", specificity: "001" },
    { selector: "tfoot", role: "rowgroup", specificity: "001" },
    { selector: "th", role: "columnheader", specificity: "001" },
    { selector: "th[scope='row']", role: "rowheader", specificity: "011" },
    { selector: "th[scope='col']", role: "columnheader", specificity: "011" },
    { selector: "thead", role: "rowgroup", specificity: "001" },
    { selector: "time", role: "time", specificity: "001" },
    { selector: "title", role: null, specificity: "001" },
    { selector: "tr", role: "row", specificity: "001" },
    { selector: "track", role: null, specificity: "001" },
    { selector: "u", role: "generic", specificity: "001" },
    { selector: "ul", role: "list", specificity: "001" },
    { selector: "var", role: null, specificity: "001" },
    { selector: "video", role: null, specificity: "001" },
    { selector: "wbr", role: null, specificity: "001" }
  ];
  // Notes:
  //   * For items with the same specificity, we put ones we want most-specific last, as in CSS.
  //       - e.g., the order of the select element selectors above matters.
  //   * img with alt="" has "img" role (not "presentation") in Chrome's computedRole. W3C disagrees.
  //   * computedRole also gives null for default td role. INTERESTING.
  //   * Some elements can have different roles with accesisble names: aside, section.
  //   * Do we want a field for permitted roles? e.g., select can sometimes have have "menu" role.
  //   * Select has different roles based on the number value of its size attribute.
  //   * How do we know if a th is rowheader or columnheader without scope?
  //       - Can first-child help us guess? or JS colspan and rowspan?
  //   * Do we need to account for th elements that are not headers and are in grid tables? Weird combo!

  function getImplicitRole(element) {
    let matchedSelector = false;
    for (let selectorInfo of selectorsAndRoles) {
      if (
        element.matches(selectorInfo.selector) &&
        (!matchedSelector || selectorInfo.specificity >= matchedSelector.specificity)
      ) {
        // If this is the first match, use it!
        // If it's a subsequent match, use it if >= specificity.
        matchedSelector = selectorInfo;
      }
    }

    if (matchedSelector) {
      return matchedSelector.role;
    }

    return false;
  }
  // TODO: Account for custom elements (including form-associated) being "generic"?

  function getExplicitRole(element) {
    const explicitRole = element.role || element.getAttribute("role") || undefined;
    return explicitRole;
  }
  // TODO: Block disallowed roles for elements?

  function getRoles(elements) {
    for (let element of elements) {
      // Ignore the display:none elements...
      if (!isHtmlElementDisplayNone(element)) {
        group(`${element.tagName.toLowerCase()} role info`);
        const implicitRole = getImplicitRole(element);
        const explicitRole = getExplicitRole(element);
        let computedRole = implicitRole;
        if (explicitRole) {
          computedRole = explicitRole;
        }
        if (element) {
          log(`${element.id} (implicit): ${implicitRole}`);
          log(`${element.id} (explicit): ${explicitRole}`);
          log(`${element.id} (computed): ${computedRole}`);
          if (element.computedRole !== undefined) {
            log(`${element.id} (Chrome computed): ${element.computedRole}`);
          }
          //dir(element);
        }
        groupEnd();
      }
    }
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

  (function init() {
    console.clear();
    group("rha11y-get-role results");
    const elements = getAllElements(document.body);
    getRoles(elements);
    groupEnd();
  })();
})();
