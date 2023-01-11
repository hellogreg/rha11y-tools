javascript: (() => {
  //
  // outputMessages toggles whether log() and dir() output anything
  let outputMessagesDefault = true;
  let outputMessages = outputMessagesDefault;

  // Custom log() and dir() functions, so we don't have to prepend with console
  //
  function log(m) {
    if (outputMessages) {
      m = m !== undefined ? m : " ";
      console.log(m);
    }
  }

  function dir(m) {
    if (outputMessages && m) {
      console.dir(m);
    }
  }

  function isImg(element) {
    return element.nodeName.toLowerCase() === "img";
  }

  function isSvg(element) {
    return element.nodeName.toLowerCase() === "svg";
  }

  // Returns an element we can use, whether in the shadow DOM or not
  function getElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

  function hideAllImages(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);

      if (isImg(element) || isSvg(element)) {
        element.style.visibility = "hidden";
      }

      if (element.style) {
        element.style.setProperty("background-image", "none");
      }

      // If the node has shadowRoot, re-run this functino for it.
      if (!!node.shadowRoot) {
        const shadowNode = node.shadowRoot;
        hideAllImages(shadowNode);
      }
    }
  }

  (function init() {
    const root = document.body;
    hideAllImages(root);
  })();
})();
