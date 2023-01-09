function findAndTestImages(root) {
  const nodes = root.querySelectorAll("*");

  for (const node of nodes) {
    if (node.nodeName.toLowerCase() === "svg") {
      log("Located an <svg>");
    }

    if (node.nodeName.toLowerCase() === "img") {
      log("Located an <img>");
    }

    // Is this the best way to locate a shadowRoot?
    const shadow = node.shadowRoot;
    if (shadow) {
      log("Located a shadowRoot.");
      log("Call this function again to check its contents...");
      findAndTestImages(shadow);
    }
  }
}

findAndTestImages(document.body);
