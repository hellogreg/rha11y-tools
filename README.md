# Rha11y img-checker bookmarklet

This bookmarklet identifies all external images (<img>) and inline SVGs (<svg>) on the page (including those in the Shadow DOM), and then evaluates them for accessibility: checking to see if they have accessible names and/or are hidden from assistive tech.

## Latest version

Drag the following link to your bookmarks bar to use the bookmarklet:
[Rha11y-img][1]
[1]:javascript:!function(){var t=document.createElement("script");t.setAttribute("src","https://rha11y-img.netlify.app/img-checker.js"),document.body.appendChild(t)}();

## Demo

[View the demo page](https://rha11y-img.netlify.app/)

## Resources:

- [alt attribute decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- [Accessible SVG patterns](https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/)
- [Comparison of SVG a11y tests methods](https://weboverhauls.github.io/demos/svg/)
- [JS minifier for creating quick local bookmarklet](https://www.toptal.com/developers/javascript-minifier)
- [Accessing lit components with renderRoot](https://lit.dev/docs/components/shadow-dom/)

## TODO list (as of 1/1/23)

- Find associated aria-labelledby ids in shadowroots.
- Determine if parents of shadowroot elements are hidden.
- Investigate why some images aren't identified (e.g., search at redhat.com)?
- Investigate why occasional images have an outline color other than the bookmarklet's pass/fail colors (e.g., the globe in the redhat.com footer).
- Do we need to account for non-<img> and non-<svg> elements with role="img"?
