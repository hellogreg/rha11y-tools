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

  function needsLabel(element) {
    let isInput = false;

    if (element.nodeName.toLowerCase() === "input") {
      if (element.type !== "hidden" && element.type !== "button" && element.type !== "submit") {
        isInput = true;
      }
    }
    isInput = isInput || element.nodeName.toLowerCase() === "meter";
    isInput = isInput || element.nodeName.toLowerCase() === "progress";
    isInput = isInput || element.nodeName.toLowerCase() === "select";
    isInput = isInput || element.nodeName.toLowerCase() === "textarea";

    return isInput;
  }

  function isLabel(element) {
    return element.nodeName.toLowerCase() === "label";
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

  function hasLabelById(labels, id) {
    for (const l in labels) {
      const labelFor = labels[l].htmlFor;

      if (labelFor && labelFor === id) {
        return true;
      }
    }
    return false;
  }

  function hasParentLabel(element) {
    element = getElement(element);
    let hasLabel = false;

    while (
      !hasLabel &&
      !!element &&
      element.nodeName !== "BODY" &&
      element.nodeName !== "HTML" &&
      element.nodeType !== Node.DOCUMENT_NODE &&
      element.nodeName
    ) {
      element = element.parentNode ? element.parentNode : null;
      element = getElement(element);
      log("Next parent: " + element.nodeName.toLowerCase());
      hasLabel = hasLabel || isLabel(element);
    }

    log("Element has parent label: " + !!hasLabel);
    return !!hasLabel;
  }

  function testFormLabels(labelsInputs) {
    const labels = labelsInputs.labels;
    const inputs = labelsInputs.inputs;
    let results = [];
    for (const i in inputs) {
      const input = inputs[i];
      const inputId = input.id;
      let hasLabel = false;

      if (inputId) {
        //Test if there's a label targeting this id
        hasLabel = hasLabel || hasLabelById(labels, inputId);
      }

      // Test if there's a parent label enclosing the input.
      hasLabel = hasLabel || hasParentLabel(input);
      results.push(inputId + " has label: " + hasLabel);
    }
    return results;
  }

  function getLabelsAndInputs(root) {
    function pushLabelsAndInputs(root) {
      const nodes = root.querySelectorAll("*");

      for (const node of nodes) {
        const element = getElement(node);

        if (needsLabel(element)) {
          inputs.push(element);
        }

        if (isLabel(element)) {
          labels.push(element);
        }

        // If the node has shadowRoot, re-run this functino for it.
        if (!!node.shadowRoot) {
          const shadowNode = node.shadowRoot;
          getLabelsAndInputs(shadowNode);
        }
      }
    }

    let labels = [];
    let inputs = [];
    pushLabelsAndInputs(root);
    return {
      labels: labels,
      inputs: inputs
    };
  }

  function outputResults(results) {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    let h2, ul, p;

    h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode("Do the form elements have labels?"));
    dialog.appendChild(h2);

    ul = document.createElement("ul");
    for (const result of results) {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(result));
      ul.appendChild(li);
    }
    dialog.appendChild(ul);

    p = document.createElement("p");
    p.appendChild(document.createTextNode("Press [esc] or refresh to close"));
    dialog.appendChild(p);

    dialog.showModal();
  }

  // https://www.w3.org/WAI/tutorials/forms/labels/
  (function init() {
    const root = document.body;
    const labelsInputs = getLabelsAndInputs(root);
    const results = testFormLabels(labelsInputs);
    outputResults(results);
  })();
})();
