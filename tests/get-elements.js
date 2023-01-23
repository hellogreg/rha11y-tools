javascript: (() => {
  let elements = [];

  function getElements(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element =
        node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? node.getRootNode().host : node;
      elements.push(element);

      // If the node has a shadowRoot, get the nodes within it.
      if (node.shadowRoot) {
        getElements(node.shadowRoot);
      }
    }
  }

  getElements(document.body);
  console.dir(elements);
})();
