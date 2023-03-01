javascript: (() => {
  //////////////////////////////////////
  //
  // CONSOLE HELPER FUNCTIONS
  //

  // Custom log() and dir() functions, so we don't have to prepend with console
  //
  function log(m) {
    m = m !== undefined ? m : "";
    console.log(m);
  }

  function dir(m) {
    if (m) {
      console.dir(m);
    }
  }
  //
  //////////////////////////////////////

  //////////////////////////////////////
  //
  // APP FUNCTIONS
  //

  function isLink(element) {
    return element.nodeName.toLowerCase() === "a" && !!element.href;
  }

  function outputResults(element, validLink) {
    // Outline the image with the pass/fail color.
    // (Must reset filters on image, too, to ensure proper outlining)
    //
    const colorPass = "#09fd";
    const colorFail = "#f90d";
    const outlineColor = !!validLink ? colorFail : colorPass;
    element.style.setProperty("outline", outlineColor + " solid 8px", "important");
    element.style.setProperty("outline-offset", "-4px", "important");
    element.style.setProperty("border-radius", "2px", "important");
    element.style.setProperty("filter", "initial", "important");
  }

  function checkAllLinks(elements) {
    for (const element of elements) {
      if (isLink(element)) {
        // Test target
        const href = element.href || null;
        //outputResults(element, opensNewWindow);

        const linkRequest = new Request(href);
        //dir(linkRequest);

        try {
          fetch(linkRequest, {}).then((response) => {
            log("Link: " + element.outerHTML);
            log("Link href: " + href);
            log(response.status); // returns 200
            log();
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  function outputElements(elements) {
    for (const el of elements) {
      dir(el);
    }
  }

  //
  //////////////////////////////////////

  //////////////////////////////////////
  //
  // INIT AND GETALLELEMENTS FUNCTIONS
  //

  function getAllElements(root) {
    let elements = [];

    function pushElements(currentRoot) {
      const nodes = currentRoot.querySelectorAll("*");

      for (const node of nodes) {
        let element;

        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          element = node.getRootNode().host;
        } else {
          element = node;
        }

        if (element.nodeType === Node.ELEMENT_NODE) {
          elements.push(element);
        }

        // If node has shadowRoot, re-call this function to get its child nodes.
        if (node.shadowRoot) {
          pushElements(node.shadowRoot);
        }
      }
    }

    pushElements(root);
    return elements;
  }

  (function init() {
    //
    // The root can be the document, its body, or whatever we want to test.
    const root = document.body;
    const elements = getAllElements(root);

    // Once we have the elements, we can run our tests on them.
    checkAllLinks(elements);
  })();

  //
  //////////////////////////////////////
})();
