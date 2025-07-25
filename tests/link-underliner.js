javascript: (() => {
  function createLinkStylesheet(root) {
    const style = document.createElement("style");

    style.innerHTML = `
/* Select and underline the links */
p a[href]:not(rh-cta a) {
  text-decoration: underline dashed 1px !important;
  text-decoration-color: light-dark(#707070, #a3a3a3) !important;
  text-underline-offset: 0.28em !important;
  transition: ease all 0.3s !important;

  &:hover {
    text-decoration-color: inherit !important;
    text-underline-offset: 0.33em !important;
  }
}`;

    document.head.appendChild(style);
  }

  (function init() {
    const root = document.body;
    createLinkStylesheet(root);
  })();
})();
