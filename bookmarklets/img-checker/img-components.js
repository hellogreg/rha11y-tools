(function () {
  customElements.define(
    "wc-div",
    class extends HTMLElement {
      constructor() {
        const template = document.createElement("template");
        template.innerHTML = `
        <div><wc-span></wc-span></div>
        `;
        super();
        this.attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
      }
    }
  );

  customElements.define(
    "wc-span",
    class extends HTMLElement {
      constructor() {
        const template = document.createElement("template");
        template.innerHTML = `
        <span><wc-img></wc-img></span>
        `;
        super();
        this.attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
      }
    }
  );

  customElements.define(
    "wc-img",
    class extends HTMLElement {
      constructor() {
        const template = document.createElement("template");
        template.innerHTML = `
        <style>
          img,
          svg {
            display: block;
            height: auto;
            max-width: 100%;
            width: 10rem;
          }
        </style>
        <img src="testimg.jpg?test=wc00" />
        `;
        super();
        this.attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
      }
    }
  );
})();
