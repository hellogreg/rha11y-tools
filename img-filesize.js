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

  function getFilesize(url) {
    let fileSize = -1;
    var http = new XMLHttpRequest();
    http.open("HEAD", url, false);
    http.send(null);
    if (http.status === 200) {
      fileSize = http.getResponseHeader("content-length");
    }
    return fileSize;
  }

  function outputResults(element, small) {
    // Outline the image with the pass/fail color.
    // (Must reset filters on image, too, to ensure proper outlining)
    //
    const colorPass = "#09fd";
    const colorFail = "#f90d";
    const outlineColor = !!small ? colorPass : colorFail;
    element.style.setProperty("outline", outlineColor + " solid 8px", "important");
    element.style.setProperty("outline-offset", "-4px", "important");
    element.style.setProperty("border-radius", "2px", "important");
    element.style.setProperty("filter", "initial", "important");
  }

  function testImageFilesizes(root) {
    const nodes = root.querySelectorAll("*");

    for (const node of nodes) {
      const element = getElement(node);

      if (isImg(element)) {
        // Test filesize
        const imgSrc = element.src;
        const filesize = getFilesize(imgSrc);
        const isSmall = filesize < 200000;
        log("Image: " + imgSrc);
        log("Filesize: " + filesize);
        log("Under 200k: " + isSmall);
        outputResults(element, isSmall);
        log();
      }

      // If the node has shadowRoot, re-run this function for it.
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
