qx.Class.define("myTasks.components.ui.Button", {
  extend: qx.ui.core.Widget,

  events: {
    "execute": "qx.event.type.Event"
  },

  construct(label, variant = "", size = "") {
    super();

    // set a layout so children get measured and laid out
    this._setLayout(new qx.ui.layout.Canvas());

    // generate Basecoat classes
    let classes = ["btn"];
    if (variant) classes.push(`btn-${variant}`);
    if (size) classes.push(`btn-${size}`);

    // embed HTML
    this._html = new qx.ui.embed.Html(`
      <button class="${classes.join(" ")}">${label}</button>
    `);

    // add child with layout properties
    this._add(this._html, { left: 0, top: 0 });

    // hook DOM click
    this._html.addListenerOnce("appear", () => {
      const btn = this._html.getContentElement().getDomElement().querySelector("button");
      btn.addEventListener("click", () => this.fireEvent("execute"));
    });
  }
});
