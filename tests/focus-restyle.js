javascript: (() => {
  function restyleFocus(root) {
    const style = document.createElement("style");

    style.innerHTML = `
      *:focus:not(:focus-visible) {
        box-shadow: none !important;
        outline: none !important;
      }
      :focus-visible, :hover:focus-visible {
        border-radius: 2px !important;
        outline: 2px solid currentColor !important;
        outline-offset: 2px !important;
      }
    `;

    if (root === "page") {
      document.head.appendChild(style);
    } else {
      root.appendChild(style);
    }
  }

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
          restyleFocus(node.shadowRoot);
          pushElements(node.shadowRoot);
        }
      }
    }
    pushElements(root);
    return elements;
  }

  (function init() {
    const root = document.body;
    const elements = getAllElements(root);
    restyleFocus("page");
  })();
})();
