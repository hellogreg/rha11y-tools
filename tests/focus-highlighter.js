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

  function highlightFocusableItems(element) {
    //https://zellwk.com/blog/keyboard-focusable-elements/

    function getKeyboardFocusableElements(element) {
      const allItems = element.querySelectorAll(
        "a[href], button, input, textarea, select, details,[tabindex]:not([tabindex='-1'])"
      );

      const filteredItems = [allItems].filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
      );

      return filteredItems;
    }

    const items = getKeyboardFocusableElements(element);
    dir(items);
  }

  (function init() {
    log();
    log("Initiating Rha11y-img bookmarklet");
    log();

    // By default, we want to test all elements in the document body.
    const root = document.body;
    highlightFocusableItems(document.body);
  })();
})();
