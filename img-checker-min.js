javascript: (() => {
  let e = !0;
  function t(t) {
    e && ((t = void 0 !== t ? t : " \n------------------------------"), console.log(t));
  }
  function n(t) {
    e && t && console.dir(t);
  }
  function l(e) {
    return e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }
  function o(e, t) {
    e.setAttribute("data-a11y", "Accessible: " + !!t),
      e.style.setProperty("outline", (t ? "#09fd" : "#f90d") + " solid 8px", "important"),
      e.style.setProperty("outline-offset", "-4px", "important"),
      e.style.setProperty("border-radius", "2px", "important"),
      e.style.setProperty("filter", "initial", "important");
  }
  function a(e) {
    let n = !!e.hasAttribute("alt");
    if ((t(" - Has alt attribute: " + n), n)) {
      let l = e.getAttribute("alt") || "[decorative]";
      t(" - Image alt value: " + l);
    }
    return !!n;
  }
  function r(e) {
    function n(e) {
      let n = !1,
        o = l(e) ? e.host.nodeName : e.nodeName;
      t("Checking if " + o + " is hidden");
      let a = !!e.hidden;
      if (((n = n || a), t(" - Has hidden attribute: " + a), l(e))) {
        t("Running shadow-specific hidden tests");
        let r = !!e.ariaHidden;
        (n = n || r), t(" - aria-hidden: " + r);
        let d = !!e.getRootNode().host.ariaHidden;
        (n = n || d), t(" - getRootNode().host.ariaHidden: " + d);
      } else {
        t("Running non-shadow hidden tests");
        let s = "none" === getComputedStyle(e).display;
        (n = n || s), t(" - display:none: " + s);
        let u = !!e.ariaHidden || "true" === e.getAttribute("aria-hidden");
        (n = n || u), t(" - aria-hidden: " + u);
        let c = "presentation" === e.getAttribute("role");
        (n = n || c), t(" - role=presentation: " + c);
      }
      return !!n;
    }
    let o = !1;
    for (
      ;
      !o &&
      e &&
      "BODY" !== e.nodeName &&
      "HTML" !== e.nodeName &&
      e.nodeType !== Node.DOCUMENT_NODE &&
      e.nodeName;

    )
      if (
        ((o = o || n(e)),
        (e = e.parentNode ? e.parentNode : l(e) ? e.getRootNode().host.parentNode : null),
        !o && e)
      ) {
        let a = l(e) ? e.host.nodeName : e.nodeName;
        t("Next parent: " + a);
      }
    return t("Either element or a parent is hidden: " + o), !!o;
  }
  function d(e) {
    let n = !1;
    t("Checking if <img> is accessible"),
      (n = !!(a(e) || r(e))),
      t("Image is accessible: " + n),
      o(e, n);
  }
  function s(e) {
    t("Checking if inline <svg> is accessible");
    let n = !1;
    (n =
      (n =
        (n =
          (n = !!(
            (function n(l) {
              let o = l.querySelector("svg > title"),
                a = o && o.textContent;
              if ((t(" - Has <title>: " + !!a), a)) {
                let r = e.querySelector("svg > title").textContent || "[unspecified]";
                t(" - title: " + r);
              }
              return !!a;
            })(e) &&
            (function e(n) {
              let l = "img" === n.getAttribute("role");
              return t(" - Has role=img: " + !!l), !!l;
            })(e)
          )) ||
          !!(function e(n) {
            let l = n.ariaLabel || n.getAttribute("aria-label"),
              o = !!l;
            return t(" - Has aria-label: " + o), o && t(" - aria-label: " + l), !!o;
          })(e)) ||
        !!(function e(n) {
          let l = n.ariaLabelledby || n.getAttribute("aria-labelledby"),
            o = !!l;
          t(" - Has aria-labelledby: " + o);
          let a,
            r = null;
          if (o) {
            var d;
            let s;
            (r = !!(a =
              ((d = l),
              (s =
                (s = s || n.getElementById(d) ? n.getElementById(d).textContent : null) ||
                document.getElementById(d)
                  ? document.getElementById(d).textContent
                  : null)))),
              t(" - aria-labelledby id: " + l),
              t(" - aria-labelledby value: " + a);
          }
          return !!o;
        })(e)) || r(e)),
      t("svg is accessible: " + n),
      o(e, n);
  }
  function u(e) {
    let n = e.querySelectorAll("svg");
    for (let l of n) t("Located an <svg>"), t(l.outerHTML), s(l), t();
    let o = e.querySelectorAll("img");
    for (let a of o) t("Located an <img>"), t(a.outerHTML), d(a), t();
    0 === n.length && 0 === o.length && (t("No <img> or <svg> elements within"), t());
  }
  function c() {
    u(document);
  }
  function f() {
    function e(n, l) {
      l = l + 1 || 1;
      let o = n.querySelectorAll("*");
      for (let a of o) {
        let r = a.shadowRoot;
        if (r) {
          let d = r.host.nodeName || "[unspecified]",
            s = r.host.id || null;
          t("Found a nested shadowRoot (nesting level " + l + "): " + d),
            s && t("id: " + s),
            u(r),
            e(r, i);
        }
      }
    }
    let n = document.querySelectorAll("*");
    for (let l of n) {
      let o = l.shadowRoot;
      if (o) {
        let a = o.host.nodeName || "[unspecified]",
          r = o.host.id || null;
        t("Found a shadowRoot: " + a), r && t("id: " + r), u(o), e(o);
      }
    }
  }
  function g() {
    let e = document.querySelectorAll("*");
    for (let n of e)
      (n.style.backgroundImage.match("url") || n.style.background.match("url")) &&
        (t("Background image found. They are not tested."),
        n.style.setProperty("background-color", "#fffd"),
        n.style.setProperty("background-blend-mode", "color"));
  }
  t("Initiating Rha11y-img bookmarklet"), t(), c(), f(), g();
})();
