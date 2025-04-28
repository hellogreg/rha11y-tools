javascript:(()=>{let t=!0;function o(o){t&&(o=void 0!==o?o:" ",console.log(o))}function e(o){t&&o&&console.dir(o)}function r(t){return"a"===t.nodeName.toLowerCase()&&!!t.href}function n(t){return t=t.nodeType===Node.DOCUMENT_FRAGMENT_NODE?t.getRootNode().host:t}function i(t,o){t.style.setProperty("outline",(o?"#09ce":"#f60e")+" solid 4px","important"),t.style.setProperty("outline-offset","3px","important"),t.style.setProperty("border-radius","3px","important"),t.style.setProperty("filter","initial","important"),t.style.setProperty("background-color",o?"#0cfe":"#fc0e","important"),t.style.setProperty("color","#039","important")}function l(t){let o=document.createElement("style");o.innerHTML=`

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

  /* Then, remove underlines from the exceptions. Would rather not have exceptions, though! */

  :is(main, [role=main]) :is(p rh-cta a) {
    background-color: #fd0 !important;
    color: #039 !important;
    outline-color: #f60e !important;
    outline-style: dashed !important;
  }
`,"page"===t?document.head.appendChild(o):t.appendChild(o)}function a(t){let o=t.querySelectorAll("*");for(let e of o)if(n(e),e.shadowRoot){let r=e.shadowRoot;a(r)}}!function t(){let o=document.body;l(o),a(o)}()})();