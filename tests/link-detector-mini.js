javascript: (() => {
  function t(t) {
    return (t = t.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? t.getRootNode().host : t);
  }
  function o(t) {
    let o = document.createElement("style");
    (o.innerHTML = `

  :is(main, [role=main]) {

    /* First, we are just identifying all links. */

    a[href] {
      background-color: #efe !important;
      color: #039 !important;
      border-radius: 4px !important;
      filter: initial !important;
      outline: #6a6e dotted 4px !important;
      outline-offset: 3px !important;
    }

    /* Add underlines to these links. */

    p a[href] {
      background-color: #0cfe !important;
      color: #039 !important;
      outline-color: #06ce !important;
      outline-style: solid !important;
    }

    /* Do not add underlines to these links that meet some success criteria. */

    p rh-cta a[href] {
      background-color: #fd0 !important;
      color: #039 !important;
      outline-color: #f60e !important;
      outline-style: dashed !important;
    }

  }
`),
      "page" === t ? document.head.appendChild(o) : t.appendChild(o);
  }
  function e(o) {
    let n = o.querySelectorAll("*");
    for (let i of n)
      if ((t(i), i.shadowRoot)) {
        let r = i.shadowRoot;
        e(r);
      }
  }
  !(function t() {
    let n = document.body;
    o(n), e(n);
  })();
})();
