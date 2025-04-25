function isImageAccessible(image) {
  //
  // if statements for both img and svg
  //
  // Does it have an aria-label?
  if (image.ariaLabel) {
    return true;
  }

  // Is it hidden?
  if (image.hidden || getComputedStyle(image).display === "none" || image.ariaHidden === "true") {
    return true;
  }

  // if statements for <img> only
  //
  if (image.tagName.toLowerCase() === "img") {
    // Does it have an alt attribute (okay even if that attribute is null)
    if (image.hasAttribute("alt")) {
      return true;
    }

    // Does it have a "presentation" role
    if (image.getAttribute("role") === "presentation") {
      return true;
    }
  }

  // if statements for <svg> only
  //
  if (image.tagName.toLowerCase() === "svg") {
    // Does it have an img role and title?
    if (
      image.getAttribute("role") === "img" &&
      image.firstElementChild.tagName.toLowerCase() === "title" &&
      image.firstElementChild.textContent
    ) {
      return true;
    }
  }

  //
  // TODO: CHECK IF A PARENT ELEMENT IS HIDDEN!
  //

  return false;
}

function testImage(imageId, resultsId) {
  const image = document.getElementById(imageId); // whatever element we're testing
  const results = document.getElementById(resultsId); // output id
  if (image.tagName.toLowerCase() === "img" || image.tagName.toLowerCase() === "svg") {
    if (isImageAccessible(image)) {
      results.textContent = "accessible";
    } else {
      results.textContent = "not accessible";
    }
  }
}

testImage("test-svg", "results-svg");
testImage("test-img", "results-img");
