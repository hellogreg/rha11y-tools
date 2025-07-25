javascript: (() => {
  function createLinkStylesheet(root) {
    const style = document.createElement("style");

    style.innerHTML = `
/* First, identify _all_ links (to underline or not). */
a[href] {
  background-color: #bfee !important;
  color: #039e !important;
  filter: initial !important;
  outline: #6a6e dotted 4px !important;
  outline-offset: 3px !important;
}


/* Then, select the links well want to underline */
p a[href]:not(rh-cta a) {
  background-color: #fe99 !important;
  color: #039 !important;
  outline-color: #06ce !important;
  outline-style: dashed !important;
}`;

    document.head.appendChild(style);
  }

  (function init() {
    const root = document.body;
    createLinkStylesheet(root);
  })();
})();
