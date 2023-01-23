javascript: (() => {
  function getElements(root) {
    const nodes = root.querySelectorAll("*");

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

      // If the node has a shadowRoot, get the nodes within it.
      if (node.shadowRoot) {
        getElements(node.shadowRoot);
      }
    }
  }

  let elements = [];
  getElements(document.body);
  console.dir(elements);
})();
