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

  let headingStructureOutput = "HEADING STRUCTURE FOR PAGE\n";

  function addLine(text) {
    headingStructureOutput = headingStructureOutput.concat("\n", text);
  }

  function getHeadingOutput(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);

      if (element.nodeName.toLowerCase() === "h1") {
        addLine("<h1>" + getCleanElementText(element) + "</h1>");
      }

      if (element.nodeName.toLowerCase() === "h2") {
        addLine("	<h2>" + getCleanElementText(element) + "</h2>");
      }

      if (element.nodeName.toLowerCase() === "h3") {
        addLine("		<h3>" + getCleanElementText(element) + "</h3>");
      }

      if (element.nodeName.toLowerCase() === "h4") {
        addLine("			<h4>" + getCleanElementText(element) + "</h4>");
      }

      if (element.nodeName.toLowerCase() === "h5") {
        addLine("				<h5>" + getCleanElementText(element) + "</h5>");
      }

      if (element.nodeName.toLowerCase() === "h6") {
        addLine("					<h6>" + getCleanElementText(element) + "</h6>");
      }

      // If the node has shadowRoot, re-run this function for it.
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
    log(headingStructureOutput);
    log();
  })();
})();
