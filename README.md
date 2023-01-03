# Rha11y img-checker bookmarklet

This bookmarklet identifies all external images (&lt;img&gt;) and inline SVGs (&lt;svg&gt;) on the page--including those in the Shadow DOM--and then evaluates them for accessibility: checking to see if they have accessible names and/or are hidden from assistive tech.

When run, the bookmarklet returns accessibility information three ways:

- All identified images on the page are given an 8px outline. A blue outline means the image passed accessibility checks. Orange means the image failed.
- Inspecting an image will reveal a **data-ally** attribute, which returns info on the element's accessibility. (Currently, the attribute just says whether the image is accessible, but giving more details is on the to-do list.)
- Detailed accessibility test processes and results are displayed in the browser console.

## Demo and latest version

[View the demo page](https://rha11y-img.netlify.app/)

## To-do list (as of 1/3/23)

- Determine if parents of shadowroot elements are hidden.
- Investigate why some images aren't identified (e.g., search magnifier at redhat.com).
- Investigate why occasional images have an outline color other than the bookmarklet's pass/fail colors (e.g., the globe in the redhat.com footer). Is there somehow an outline with more specificity than an inline style with "!important"?
- Find associated aria-labelledby ids in shadowroots. (Currently, we can locate them in the regular DOM and as children of the tested element. But the element could be elsewhere.)
- Should all inline SVGs be required to have role="img"? Currently, we're requiring it for SVGs with title elements, but not aria-label/labelledby attributes.
- Do we need to account for non-img/svg elements with role="img"?

## Resources

- [alt attribute decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- [Accessible SVG patterns](https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/)
- [Comparison of SVG a11y tests methods](https://weboverhauls.github.io/demos/svg/)
- [JS minifier for creating quick local bookmarklet](https://www.toptal.com/developers/javascript-minifier)
- [Accessing lit components with renderRoot](https://lit.dev/docs/components/shadow-dom/)
