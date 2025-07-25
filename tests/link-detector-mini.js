javascript:(()=>{function t(t){let e=document.createElement("style");e.innerHTML=`
/* First, identify _all_ links (to underline or not). */
a[href] {
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
}`,document.head.appendChild(e)}!function e(){let n=document.body;t(n)}()})();