javascript: (() => {
  // Returns an element we can use, whether in the shadow DOM or not
  function getElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

  function createLinkStylesheet(root) {
    const style = document.createElement("style");

    style.innerHTML = `

      /* These links will be ignored altogether. */

      :is(main, [role=main]) a[href] {
        background-color: #efe !important;
        color: #039 !important;
        border-radius: 4px !important;
        filter: initial !important;
        outline: #6a6e dotted 4px !important;
        outline-offset: 3px !important;
      }

      /* First, add underlines to these links. */

      :is(main, [role=main]) :is(p a[href]) {
        background-color: #0cfe !important;
        color: #039 !important;
        outline-color: #06ce !important;
        outline-style: solid !important;
      }

      /* Then, remove underlines from the exceptions. Would rather not have exceptions, though! */

      :is(main, [role=main]) :is(p rh-cta a[href]) {
        background-color: #fd0 !important;
        color: #039 !important;
        outline-color: #f60e !important;
        outline-style: dashed !important;
      }
    `;

    if (root === "page") {
      document.head.appendChild(style);
    } else {
      root.appendChild(style);
    }
  }

  function testLinkTargets(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);

      // If the node has shadowRoot, re-run this function for it.
      if (!!node.shadowRoot) {
        const shadowNode = node.shadowRoot;
        testLinkTargets(shadowNode);
      }
    }
  }

  (function init() {
    //const root = document.getElementById("test-content"); // For testing only
    const root = document.body; // The real deal
    createLinkStylesheet(root);
    testLinkTargets(root);
  })();
})();
