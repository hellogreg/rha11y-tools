javascript: (() => {
  // https://dev.to/natclark/checking-for-reduced-motion-preference-in-javascript-4lp9
  // https://webkit.org/blog-files/prefers-reduced-motion/prm.htm

  function checkMotionPreference() {
    const prefersReduced =
      window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
      window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    return prefersReduced;
  }

  function outputResults(prefersReduced) {
    const dialog = document.createElement("dialog");
    document.body.appendChild(dialog);

    let h2, p;

    h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode("Your current motion preference"));
    dialog.appendChild(h2);

    p = document.createElement("p");
    p.appendChild(document.createTextNode("prefers-reduced-motion on: " + prefersReduced));
    dialog.appendChild(p);

    p = document.createElement("p");
    p.appendChild(document.createTextNode("Press [esc] or refresh to close"));
    dialog.appendChild(p);

    dialog.showModal();
  }

  const prefersReducedMotion = checkMotionPreference();
  outputResults(prefersReducedMotion);
})();
