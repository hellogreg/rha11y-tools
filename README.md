# rha11y img-checker bookmarklet

## Overview

This bookmarklet identifies all external images (&lt;img&gt;) and inline SVGs (&lt;svg&gt;) on the page--including those in the Shadow DOM--and then evaluates them for accessibility: checking to see if they have accessible names and/or are hidden from assistive tech.

When run, the bookmarklet returns accessibility information three ways:

- All identified foreground images on the page are given an 8px outline.
  - Blue outline = image passed accessibility checks
  - Orange outline = image failed
  - No outline = image not identified
  - Background images are faded/hidden and not tested
- Detailed accessibility test processes and results are displayed in the browser console.
- Inspecting an image will reveal a **data-ally** attribute, which returns info on the element's accessibility. (Currently, the attribute just says whether the image is accessible, but giving more details is on the to-do list.)

## Demo and latest version

**[View the demo page, where you can install the bookmarklet.](https://rha11y-img.netlify.app/)**

## Features

rha11y-img (hopefully) identifies images that other tools can't and runs tests that they don't:

- Some tools have difficulty locating all images in the Shadow DOM, particularly when nested more than one level deep.
- Most other tools don't run full tests on inline SVGs, ensuring that they have accessible names and/or are hidden from assistive tech.

The bookmarklet finds and tests images in the following order:

1. Inline SVGs (&lt;svg&gt;) in the regular DOM
2. External images (&lt;img&gt;) in the regular DOM
3. Inline SVGs in the top-level Shadow DOM
4. External images in the top-level Shadow DOM
5. Inline SVGs in a nested second-level Shadow DOM
6. External images in a nested second-level Shadow DOM
7. ...and so on.

It checks SVGs to see if:

- They have an accessible name (via the role="img" attribute and title element, aria-label, or aria-labelledby)  
  _-or-_
- They (or any of their parents) are hidden from assistive technology

It checks external images to ensure:

- They have an alt attribute (with or a without a value)  
  _-or-_
- They (or any of their parents) are hidden from assistive technology

It ignores background images (and in fact fades them out, to give a visual clue that they aren't being tested).

## To-do list

### Unresolved

- Find associated aria-labelledby ids in shadowroots. (Currently, we can locate them in the regular DOM and as children of the tested element. But the element could be elsewhere.)
- Should all inline SVGs be required to have role="img"? Currently, we're requiring it for SVGs with title elements, but not aria-label/labelledby attributes.
- Do we need to account for non-img/svg elements with role="img"? (Probably not, but maybe?)
- Add more detail to the data-a11y attribute than just "Accessible: true/false."

### Resolved

- Determine if parents of shadowroot elements are hidden.  
  **Solved 1/6/22: This is now working properly**
- Detect aria-hidden in web component (e.g., &lt;pfe-icon aria-hidden="true"&gt;)  
  **Solved 1/5/22: Using element.getRootNode().host.ariaHidden does the trick!**
- Handle background images somehow, to show they're different from other images. Should we hide them or fade them out a bit?  
  **Solved 1/5/22: Currently doing the latter.**
- Ensure all outlines are visible. (e.g., the Recommended for you images at [redhat.com](https://www.redhat.com/en) are located, but the outline isn't visible--perhaps because the images are contained in another element of their exact height/width)  
  **Solved 1/4/22: Using outline-offset allows us to inset the outline a bit, to make outlines visible on images inside same-height/width containers.**
- Investigate why occasional images have an outline color other than the bookmarklet's pass/fail colors (e.g., the globe in the [redhat.com](https://www.redhat.com/en) footer).  
  **Solved 1/4/22: Looks like this was a result of CSS filters being used; we now reset them to initial when the script runs.**

## Resources

- [Accessible SVG patterns](https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/)
- [Matrix of SVG browser test results](https://weboverhauls.github.io/demos/svg/)
- [W3C Discussion of ARIA roles for SVGs](https://www.w3.org/wiki/SVG_Accessibility/ARIA_roles_for_graphics)
- [WAI-ARIA infor on the img role](https://www.w3.org/TR/wai-aria-1.0/roles#img)
- [alt attribute decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- [JS minifier for creating quick local bookmarklet](https://www.toptal.com/developers/javascript-minifier)
- [Accessing lit components with renderRoot](https://lit.dev/docs/components/shadow-dom/)
