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

  function outputElements(elements) {
    for (const el of elements) {
      dir(el);
    }
  }

  //
  //////////////////////////////////////

  //////////////////////////////////////
  //
  // INIT FUNCTION
  //

  (function init() {
    //
    // The root can be the document, its body, or whatever we want to test.
    const root = document.body;
    const elements = getAllElements(root);

    // Once we have the elements, we can run our tests on them.
    outputElements(elements);
  })();
})();
