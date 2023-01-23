javascript: (() => {
  // Returns an element we can use, whether in the shadow DOM or not
  function getElement(element) {
    if (element.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      element = element.getRootNode().host;
    }
    return element;
  }

  function getAllNodes(root) {
    console.group();

    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);
      console.dir(element);

      // If the node has shadowRoot, re-run this function for it.
      if (node.shadowRoot) {
        getAllNodes(node.shadowRoot);
      }
    }

    console.groupEnd;
  }

  (function init() {
    const root = document.body;
    const allNodes = getAllNodes(root);
    dir(allNodes);
  })();
})();
