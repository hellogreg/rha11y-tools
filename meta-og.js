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

  function getOgMetas() {
    const metas = document.getElementsByTagName("meta");
    let ogMetas = [];

    for (const meta of metas) {
      if (meta.getAttribute("property") && meta.getAttribute("property").includes("og:")) {
        ogMetas.push(meta);
      }
    }

    return ogMetas;
  }

  function outputResults(metas) {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    let h2, ul, li, p, div;

    h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode("Open Graph meta values"));
    dialog.appendChild(h2);

    ul = document.createElement("ul");
    ul.style.marginBottom = "2rem";
    for (const meta of metas) {
      const metaProperty = meta.attributes.property.value;
      const metaContent = meta.attributes.content.value;

      li = document.createElement("li");
      li.style.margin = "0 0 1rem 0";
      li.style.padding = "0";

      div = document.createElement("div");
      div.style.fontWeight = "700";
      div.appendChild(document.createTextNode(metaProperty));
      li.appendChild(div);

      div = document.createElement("div");
      div.appendChild(document.createTextNode(metaContent));
      li.appendChild(div);

      ul.appendChild(li);
    }
    dialog.appendChild(ul);

    p = document.createElement("p");
    p.appendChild(document.createTextNode(" "));
    dialog.appendChild(p);
    p = document.createElement("p");
    p.style.fontStyle = "italic";
    p.appendChild(document.createTextNode("Press [esc] or refresh the page to close this window."));
    dialog.appendChild(p);

    dialog.showModal();
  }

  (function init() {
    log();
    const metas = getOgMetas();
    outputResults(metas);
    log();
  })();
})();
