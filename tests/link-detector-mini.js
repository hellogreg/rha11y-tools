javascript:(()=>{function o(o){return o=o.nodeType===Node.DOCUMENT_FRAGMENT_NODE?o.getRootNode().host:o}function t(o){let t=document.createElement("style");t.innerHTML=`

  /* These links will be ignored altogether. */

  :is(main, [role=main]) a[href] {
    background-color: #efe !important;
    color: #039 !important;
    border-radius: 4px !important;
    filter: initial !important;
    outline: #6a6e dotted 4px !important;
    outline-offset: 3px !important;
  }

  /* First, add underlines to these links. */

  :is(main, [role=main]) :is(p a[href]) {
    background-color: #0cfe !important;
    color: #039 !important;
    outline-color: #06ce !important;
    outline-style: solid !important;
  }

  /* Then, remove underlines from the exceptions. Would rather not have exceptions, though! */

  :is(main, [role=main]) :is(p rh-cta a[href]) {
    background-color: #fd0 !important;
    color: #039 !important;
    outline-color: #f60e !important;
    outline-style: dashed !important;
  }
`,"page"===o?document.head.appendChild(t):o.appendChild(t)}function e(t){let e=t.querySelectorAll("*");for(let n of e)o(n),n.shadowRoot&&n.shadowRoot}!function o(){let n=document.body;t(n),e(n)}()})();