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

    // 3) Get page meta description
    const metaDescription = document.querySelector("meta[name='description']");
    const pageDescription = metaDescription ? metaDescription.content : false;
    const hasPageDescription = !!pageDescription;
    log(`Page has meta description: ${hasPageDescription}`);
    log(`Page meta description: ${pageDescription}`);

    return {
      title: pageTitle,
      lang: pageLang,
      description: pageDescription
    };
  }

  function outputResults(info) {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    let h2, h3, ul, li, p;
    const title = info.title;
    const lang = info.lang;
    const description = info.description;

    h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode("Basic page info"));
    dialog.appendChild(h2);

    h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode("Title"));
    dialog.appendChild(h3);

    ul = document.createElement("ul");
    ul.style.marginBottom = "2rem";
    li = document.createElement("li");
    if (!!title) {
      li.appendChild(document.createTextNode(title));
    } else {
      li.appendChild(document.createTextNode("[No title found]"));
    }
    ul.appendChild(li);
    dialog.appendChild(ul);

    h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode("Language"));
    dialog.appendChild(h3);

    ul = document.createElement("ul");
    ul.style.marginBottom = "2rem";
    li = document.createElement("li");
    if (!!lang) {
      li.appendChild(document.createTextNode(lang));
    } else {
      li.appendChild(document.createTextNode("[No language found]"));
    }
    ul.appendChild(li);
    dialog.appendChild(ul);

    h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode("Meta Description"));
    dialog.appendChild(h3);

    ul = document.createElement("ul");
    ul.style.marginBottom = "3rem";
    li = document.createElement("li");
    if (!!description) {
      li.appendChild(document.createTextNode(description));
    } else {
      li.appendChild(document.createTextNode("[No description found]"));
    }
    ul.appendChild(li);
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
