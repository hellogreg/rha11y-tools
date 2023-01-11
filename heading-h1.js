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

  // Returns an element we can use, whether in the shadow DOM or not
  function getElement(element) {
    element =
      element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? element.getRootNode().host : element;
    return element;
  }

  function getCleanElementText(element) {
    let text = element.textContent || "[empty]";
    text = text.replace(/(\r\n|\n|\r)/gm, "");
    text = text.trim();
    return text;
  }

  let headingStructureOutput = "PAGE <h1> INFORMATION";
  let h1Count = 0;

  function addLine(text) {
    headingStructureOutput = headingStructureOutput.concat("\n\n", text);
  }

  function getHeadingOutput(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);

      if (element.nodeName.toLowerCase() === "h1") {
        addLine("<h1>" + getCleanElementText(element) + "</h1>");
        h1Count += 1;
      }

      // If the node has shadowRoot, re-run this functino for it.
      if (!!node.shadowRoot) {
        const shadowNode = node.shadowRoot;
        getHeadingOutput(shadowNode);
      }
    }
  }

  (function init() {
    log();
    const root = document.body;
    getHeadingOutput(root);
    addLine("FOUND " + h1Count + " <h1> ELEMENT(S)");
    alert(headingStructureOutput);
    log();
  })();
})();
