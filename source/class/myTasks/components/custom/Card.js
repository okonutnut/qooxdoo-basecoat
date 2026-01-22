qx.Class.define("myTasks.components.custom.Card", {
  extend: qx.ui.container.Composite,

  construct: function (title, content) {
    this.base(arguments);

    // Layout for the card
    this.setLayout(new qx.ui.layout.VBox(10));
    this.setPadding(10);
    this.setBackgroundColor("#ffffff");
    this.setDecorator("main"); // optional: adds border/shadow if defined in theme

    // Title
    var label = new qx.ui.basic.Label(title);
    label.setFont(new qx.bom.Font(16, ["Arial"], ["bold"]));
    label.setTextColor("#333");
    this.add(label);

    // Content area
    var contentContainer = new qx.ui.container.Composite(
      new qx.ui.layout.VBox(5),
    );
    contentContainer.add(content);
    this.add(contentContainer, { flex: 1 });

    // Hover effect
    this.addListener("mouseover", () => this.setDecorator("main-hover"));
    this.addListener("mouseout", () => this.setDecorator("main"));
  },
});
