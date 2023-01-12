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

  function getCleanText(element) {
    let text = element.textContent || "[empty]";
    text = text.replace(/(\r\n|\n|\r)/gm, "");
    text = text.trim();
    return text;
  }

  let h1Count = 0;
  let h1Elements = [];

  function addResult(text) {
    h1Count = h1Elements.push(text);
  }

  function testH1Headings(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);

      if (element.nodeName.toLowerCase() === "h1") {
        addResult("<h1>" + getCleanText(element) + "</h1>");
      }

      // If the node has shadowRoot, re-run this functino for it.
      if (!!node.shadowRoot) {
        const shadowNode = node.shadowRoot;
        testH1Headings(shadowNode);
      }
    }
  }

  function outputResults() {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    let h2, ul, p;

    h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode("H1 elements on this page"));
    dialog.appendChild(h2);

    ul = document.createElement("ul");
    for (const h1Element of h1Elements) {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(h1Element));
      ul.appendChild(li);
    }
    dialog.appendChild(ul);

    p = document.createElement("p");
    p.appendChild(document.createTextNode("Number of H1 elements: " + h1Count));
    dialog.appendChild(p);

    p = document.createElement("p");
    p.appendChild(document.createTextNode("(Press [esc] to close this modal)"));
    dialog.appendChild(p);

    dialog.showModal();
  }

  (function init() {
    log();
    const root = document.body;
    testH1Headings(root);
    outputResults();
    //alert(headingStructureOutput);
    log();
  })();
})();
