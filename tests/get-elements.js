javascript: (() => {
  let elements = [];

  function getElements(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      // If the node is a document fragment, get its host element.
      const element =
        node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? node.getRootNode().host : node;

      // If this is truly an element, add it to the elements[] array.
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
