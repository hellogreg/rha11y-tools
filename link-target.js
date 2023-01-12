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
    return element.nodeName.toLowerCase() === "a";
  }

  // Returns an element we can use, whether in the shadow DOM or not
  function getElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

  function outputResults(element, newWin) {
    // Outline the image with the pass/fail color.
    // (Must reset filters on image, too, to ensure proper outlining)
    //
    const colorPass = "#09fd";
    const colorFail = "#f90d";
    const outlineColor = !!newWin ? colorFail : colorPass;
    element.style.setProperty("outline", outlineColor + " solid 8px", "important");
    element.style.setProperty("outline-offset", "-4px", "important");
    element.style.setProperty("border-radius", "2px", "important");
    element.style.setProperty("filter", "initial", "important");
  }

  function testImageFilesizes(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);

      if (isLink(element)) {
        // Test target
        const href = element.href || null;
        const target = element.target || null;
        const opensNewWindow = !!target && !!target !== "_self";
        log("Link: " + element.outerHTML);
        log("Link href: " + href);
        log("Link target: " + target);
        log("Opens new window: " + opensNewWindow);
        outputResults(element, opensNewWindow);
        log();
      }

      // If the node has shadowRoot, re-run this functino for it.
      if (!!node.shadowRoot) {
        const shadowNode = node.shadowRoot;
        testImageFilesizes(shadowNode);
      }
    }
  }

  (function init() {
    const root = document.body;
    testImageFilesizes(root);
  })();
})();
