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

  function isLink(element) {
    return element.nodeName.toLowerCase() === "a" && !!element.href;
  }

  // Returns an element we can use, whether in the shadow DOM or not
  function getElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

  function outputResults(element, getsUnderline) {
    // Outline the image with the pass/fail color.
    // (Must reset filters on image, too, to ensure proper outlining)
    //
    const colorPass = "#09ce";
    const colorFail = "#f60e";
    const outlineColor = !!getsUnderline ? colorPass : colorFail;
    const bgColor = !!getsUnderline ? "#0cfe" : "#fc0e";
    element.style.setProperty("outline", outlineColor + " solid 4px", "important");
    element.style.setProperty("outline-offset", "3px", "important");
    element.style.setProperty("border-radius", "3px", "important");
    element.style.setProperty("filter", "initial", "important");
    element.style.setProperty("background-color", bgColor, "important");
    element.style.setProperty("color", "#039", "important");
  }

  function testLinkTargets(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);

      if (isLink(element)) {
        log("Link: " + element.textContent);
        log("Link href: " + element.href);

        const getsUnderline = element.closest("p");
        log("Link is in paragraph: " + !!getsUnderline);

        outputResults(element, getsUnderline);
        log();
      }

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
    testLinkTargets(root);
  })();
})();
