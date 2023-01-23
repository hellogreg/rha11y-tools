javascript: (() => {
  // Returns an element we can use, whether in the shadow DOM or not
  function getElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

  function getAllNodes(root) {
    console.group();

    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);

      // If the node has shadowRoot, re-run this function for it.
      if (!!node.shadowRoot) {
        const shadowNode = node.shadowRoot;
        getAllNodes(shadowNode);
      }
    }
  }

  (function init() {
    const root = document.body;
    const allNodes = getAllNodes(root);
    dir(allNodes);
  })();
})();
