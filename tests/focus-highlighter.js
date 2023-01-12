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

  function highlightElements(elements) {
    for (const element of elements) {
      dir(element);
      element.style.setProperty("outline", "#f90d solid 8px", "important");
      element.style.setProperty("outline-offset", "-4px", "important");
      element.style.setProperty("border-radius", "2px", "important");
      element.style.setProperty("filter", "initial", "important");
    }
  }

  function highlightFocusableItems(element) {
    //https://zellwk.com/blog/keyboard-focusable-elements/

    function getKeyboardFocusableElements(element) {
      let allItems = element.querySelectorAll(
        "a[href], button, input, textarea, select, details,[tabindex]:not([tabindex='-1'])"
      );

      dir(allItems);
      allItems = Array.from(allItems);

      const filteredItems = allItems.filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
      );

      return filteredItems;
    }

    const elements = getKeyboardFocusableElements(element);
    highlightElements(elements);
  }

  (function init() {
    const root = document.body;
    highlightFocusableItems(document.body);
  })();
})();
