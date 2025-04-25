function getRegisteredCustomElements() {
  // This is a failing approach !!
  let registered = [];
  Array.from(document.getElementsByTagName("*")).forEach((tag) => {
    let tagName = tag.tagName.toLowerCase(); // current tag name in lower case

    if (
      registered.findIndex((tag) => tag == tagName) == -1 && // avoid duplicates
      tagName.includes("-")
    ) {
      // a custom element name must use at least one '-'
      registered.push(tagName);
    }
  });
  return registered;
}

getRegisteredCustomElements();
getRegisteredCustomElements().filter((x) => x.includes("rh-"));

/*
Array.from(document.querySelectorAll('*'))
  .filter(x => r.localName.startsWith('rh-'))
*/

/*
Array.from(document.querySelectorAll('*'))
  .filter(x => x.localName.startsWith('rh-'))
  .map(x => x.localName + '@' + (x.constructor.version ?? 'unknown'))
*/
If a success criterion is met at any point, the test passes.

