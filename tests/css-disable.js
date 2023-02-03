javascript: (() => {
  function removeAllStyles(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      let element;

      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        element = node.getRootNode().host;
      } else {
        element = node;
      }

      // TODO: FIGURE OUT HOW TO DISABLE CSS LOADED VIA JS, LIKE AT redhat.com!

      if (element.nodeType === Node.ELEMENT_NODE) {
        if (element.hasAttribute("style")) {
          console.dir(element);
          element.removeAttribute("style");
        }

        if (element.tagName === "STYLE") {
          console.dir(element);
          element.parentElement.removeChild(element);
        }

        if (element.tagName === "LINK" && element.getAttribute("rel") === "stylesheet") {
          console.dir(element);
          element.parentElement.removeChild(element);
        }
      }

      // If node has shadowRoot, re-call this function to get its child nodes.
      if (node.shadowRoot) {
        removeAllStyles(node.shadowRoot);
      }
    }
  }

  removeAllStyles(document);
})();
