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

  function getDocumentInfo() {
    // 1) Get page title
    const pageTitle = document.title;
    const hasPageTitle = !!pageTitle;
    log(`Page has title: ${hasPageTitle}`);
    log(`Page title: ${pageTitle}`);

    // 2) Get page language
    const pageLang = document.documentElement.lang;
    const hasPageLang = !!pageLang;
    log(`Page has language specified: ${hasPageLang}`);
    log(`Page language: ${pageLang}`);

    return {
      pageTitle: pageTitle,
      hasPageTitle: hasPageTitle,
      pageLang: pageLang,
      hasPageLang: hasPageLang
    };
  }

  function outputResults(info) {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    let h2, h3, ul, li, p;
    const pageTitle = info.pageTitle;
    const hasPageTitle = info.hasPageTitle;
    const pageLang = info.pageLang;
    const hasPageLang = info.hasPageLang;

    h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode("Page info"));
    dialog.appendChild(h2);

    p = document.createElement("p");
    p.style.fontStyle = "italic";
    p.appendChild(document.createTextNode("Press [esc] or refresh the page to close this window."));
    dialog.appendChild(p);

    h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode("Title"));
    dialog.appendChild(h3);

    ul = document.createElement("ul");
    ul.style.marginBottom = "2rem";
    li = document.createElement("li");
    li.appendChild(document.createTextNode("Title present: " + hasPageTitle));
    ul.appendChild(li);
    if (!!hasPageTitle) {
      li = document.createElement("li");
      li.appendChild(document.createTextNode("Page title: " + pageTitle));
      ul.appendChild(li);
    }
    dialog.appendChild(ul);

    h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode("Language"));
    dialog.appendChild(h3);

    ul = document.createElement("ul");
    ul.style.marginBottom = "2rem";
    li = document.createElement("li");
    li.appendChild(document.createTextNode("Language specified: " + hasPageLang));
    ul.appendChild(li);
    if (!!hasPageLang) {
      li = document.createElement("li");
      li.appendChild(document.createTextNode("Page language: " + pageLang));
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
    const info = getDocumentInfo();
    outputResults(info);
    log();
  })();
})();
