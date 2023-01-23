javascript: (() => {
  let elements = [];

  function getElements(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      // Assign a value to the element variable.
      // If the node is a document fragment, assign its host element.
      // Otherwise, just assign the node to element.
      const element =
        node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? node.getRootNode().host : node;

      // If this node (or its host) is truly an element, add it to the elements[] array.
      if (element.nodeType === Node.ELEMENT_NODE) {
        elements.push(element);
      }

      // If the node has a shadowRoot, get the nodes within it.
      if (node.shadowRoot) {
        getElements(node.shadowRoot);
      }
    }
  }

  getElements(document.body);
  console.dir(elements);
})();
