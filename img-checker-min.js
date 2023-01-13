javascript: (() => {
  let e = !0;
  function t(t) {
    e && ((t = void 0 !== t ? t : " "), console.log(t));
  }
  function n(t) {
    e && t && console.dir(t);
  }
  function i(e, t) {
    e.setAttribute("data-a11y", "Accessible: " + !!t),
      e.style.setProperty("outline", (t ? "#09fd" : "#f90d") + " solid 8px", "important"),
      e.style.setProperty("outline-offset", "-4px", "important"),
      e.style.setProperty("border-radius", "2px", "important"),
      e.style.setProperty("filter", "initial", "important");
  }
  function o(e) {
    return "img" === e.nodeName.toLowerCase();
  }
  function a(e) {
    return "svg" === e.nodeName.toLowerCase();
  }
  function r(e) {
    return !!e.shadowRoot;
  }
  function l(e) {
    return (e = e.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? e.getRootNode().host : e);
  }
  function d(e) {
    let n = !1,
      i = e.nodeName;
    t("  Checking if " + i.toLowerCase() + " is hidden");
    let r = !!e.hidden;
    (n = n || r), t("  - hidden attribute: " + r);
    let l = "none" === getComputedStyle(e).display;
    (n = n || l), t("  - display:none: " + l);
    let d = "hidden" === getComputedStyle(e).visibility;
    (n = n || d), t("  - visbility:hidden: " + d);
    let s = !!e.ariaHidden || "true" === e.getAttribute("aria-hidden");
    if (((n = n || s), t("  - aria-hidden: " + s), o(e) || a(e))) {
      let u = "presentation" === e.getAttribute("role");
      (n = n || u), t("  - role=presentation: " + u);
    }
    return !!n;
  }
  function s(e) {
    function n(e) {
      return (
        !!e &&
        "BODY" !== e.nodeName &&
        "HTML" !== e.nodeName &&
        e.nodeType !== Node.DOCUMENT_NODE &&
        e.nodeName
      );
    }
    e = l(e);
    let i = !1;
    for (; !i && n(e); )
      (i = i || d(e)),
        (e = l((e = e.parentNode ? e.parentNode : null))),
        !i && n(e) && t("Next parent: " + e.nodeName.toLowerCase());
    return t("Either element or a parent is hidden: " + !!i), !!i;
  }
  function u(e) {
    let n = !!e.hasAttribute("alt");
    if ((t("  - Has alt attribute: " + n), n)) {
      let i = e.getAttribute("alt") || "[decorative]";
      t("  - Image alt value: " + i);
    }
    return !!n;
  }
  function c(e) {
    let n = "title" === e.firstElementChild.tagName && !!e.firstElementChild.textContent;
    return (
      t("  - Has <title>: " + !!n), n && t("  - title: " + e.firstElementChild.textContent), !!n
    );
  }
  function f(e) {
    let n = "img" === e.getAttribute("role");
    return t("  - Has role=img (not required/sufficient on its own): " + !!n), !!n;
  }
  function g(e) {
    let n = e.ariaLabel || e.getAttribute("aria-label"),
      i = !!n;
    return t("  - Has aria-label: " + i), i && t("  - aria-label: " + n), !!i;
  }
  function m(e) {
    let t = document.getElementById(e);
    return t ? t.textContent : null;
  }
  function b(e) {
    let n = e.ariaLabelledby || e.getAttribute("aria-labelledby"),
      i = !!n;
    t("  - Has aria-labelledby: " + i);
    let o,
      a = null;
    return (
      i &&
        ((a = !!(o = m(n))),
        t("  - aria-labelledby id: " + n),
        t("  - aria-labelledby value: " + o)),
      !!i
    );
  }
  function h(e) {
    let n = !1;
    t("Checking if <img> has an alt attribute"),
      (n = n || u(e)) ||
        (t("Checking if <img> or parent is hidden from assistive tech"), (n = s(e))),
      t("<img> is accessible: " + n),
      i(e, n);
  }
  function y(e) {
    let n = !1;
    t("Checking if inline <svg> has an accessible name"),
      f(e),
      (n = (n = (n = n || !!c(e)) || !!g(e)) || !!b(e)) ||
        (t("Checking if <svg> or parent is hidden from assistive tech"), (n = s(e))),
      t("<svg> is accessible: " + n),
      i(e, n);
  }
  function p(e) {
    e = l(e);
    let n = window.getComputedStyle(e).background,
      i = window.getComputedStyle(e).backgroundImage;
    e.style &&
      (n.match("url") || i.match("url") || i.match("var")) &&
      (t("Background image found. They are not tested."),
      e.style.setProperty("background-color", "#fffd"),
      e.style.setProperty("background-blend-mode", "color"));
  }
  let N = 0;
  function C(e) {
    let n = e.querySelectorAll("*");
    for (let i of n) {
      if (
        (o(i) && (t(), t("Located an <img>"), t(i.outerHTML), h(i)),
        a(i) && (t(), t("Located an <svg>"), t(i.outerHTML), y(i)),
        r(i))
      ) {
        let l = i.shadowRoot,
          d = l.getRootNode().host.nodeName || "[unspecified]";
        t("Entering " + d + " shadowRoot at nesting level " + (N += 1)), C(l);
      }
      p(i);
    }
    let s = e.getRootNode().host ? e.getRootNode().host.nodeName : null;
    N > 0 && s && (t(), t("Exiting " + s + " shadowRoot at nesting level " + N), (N -= 1)), t();
  }
  !(function e() {
    t(), t("Initiating rha11y-tools bookmarklet"), t();
    let n = document.body;
    C(n);
  })();
})();
