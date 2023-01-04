# Rha11y img-checker bookmarklet

This bookmarklet identifies all external images (&lt;img&gt;) and inline SVGs (&lt;svg&gt;) on the page--including those in the Shadow DOM--and then evaluates them for accessibility: checking to see if they have accessible names and/or are hidden from assistive tech.

When run, the bookmarklet returns accessibility information three ways:

- All identified images on the page are given an 8px outline.
  - Blue outline = image passed accessibility checks
  - Orange ouline = image failed
  - No outline = image not identified
  - Background images are faded/hidden and not tested
- Detailed accessibility test processes and results are displayed in the browser console.
- Inspecting an image will reveal a **data-ally** attribute, which returns info on the element's accessibility. (Currently, the attribute just says whether the image is accessible, but giving more details is on the to-do list.)

## Demo and latest version

[View the demo page](https://rha11y-img.netlify.app/)

## To-do list

### Unresolved

- Determine if parents of shadowroot elements are hidden. (e.g., the topnav icons at [redhat.com](https://www.redhat.com/en) fail because pfe-icon isn't properly identified as hidden)
- Ensure all images are identified.
- Find associated aria-labelledby ids in shadowroots. (Currently, we can locate them in the regular DOM and as children of the tested element. But the element could be elsewhere.)
- Should all inline SVGs be required to have role="img"? Currently, we're requiring it for SVGs with title elements, but not aria-label/labelledby attributes.
- Do we need to account for non-img/svg elements with role="img"?
- Handle background images somehow, to show they're different from other images. Should we hide them or fade them out a bit? Currently doing the latter.

### Resolved (as of 1/3/23)

- ~~Ensure all outlines are visible. (e.g., the Recommended for you images at [redhat.com](https://www.redhat.com/en) are located, but the outline isn't visible--perhaps because the images are contained in another element of their exact height/width)~~ **Solved 1/4/22: Using ouline-offset allows us to inset the outline a bit, to make oulines visible on images inside same-height/width containers.**
- ~~Investigate why occasional images have an outline color other than the bookmarklet's pass/fail colors (e.g., the globe in the [redhat.com](https://www.redhat.com/en) footer).~~ **Solved 1/4/22: Looks like this was a result of CSS filters being used; we now reset them to initial.**

## Resources

- [Accessible SVG patterns](https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/)
- [Matrix of SVG browser test results](https://weboverhauls.github.io/demos/svg/)
- [alt attribute decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- [JS minifier for creating quick local bookmarklet](https://www.toptal.com/developers/javascript-minifier)
- [Accessing lit components with renderRoot](https://lit.dev/docs/components/shadow-dom/)
