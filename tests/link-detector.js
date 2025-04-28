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

  function createLinkStylesheet(root) {
    const style = document.createElement("style");

    style.innerHTML = `

      /* These links will be ignored altogether. */

      :is(main, [role=main]) a {
        background-color: #efe !important;
        color: #039 !important;
        border-radius: 4px !important;
        filter: initial !important;
        outline: #6a6e dotted 4px !important;
        outline-offset: 3px !important;
      }

      /* First, add underlines to these links. */

      :is(main, [role=main]) :is(p a) {
        background-color: #0cfe !important;
        color: #039 !important;
        outline-color: #06ce !important;
        outline-style: solid !important;
      }

      /* Then, remove underlines from the exceptions. Would rather not do this! */

      :is(main, [role=main]) :is(p rh-cta a) {
        background-color: #fd0 !important;
        color: #039 !important;
        outline-color: #f60e !important;
        outline-style: dashed !important;
      }
    `;

    if (root === "page") {
      document.head.appendChild(style);
    } else {
      root.appendChild(style);
    }
  }

  function testLinkTargets(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);

      /*
      if (isLink(element)) {
        log("Link: " + element.textContent);
        log("Link href: " + element.href);

        const getsUnderline = element.closest("p");
        log("Link is in paragraph: " + !!getsUnderline);

        outputResults(element, getsUnderline);
        log();
      }
      */

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
    createLinkStylesheet(root);
    testLinkTargets(root);
  })();
})();
