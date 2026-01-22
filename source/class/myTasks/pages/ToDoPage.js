qx.Class.define("myTasks.pages.ToDoPage", {
  extend: qx.ui.container.Composite,

  construct() {
    this.base(arguments);

    this.setLayout(new qx.ui.layout.Canvas());

    var layout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    var header = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
    header.setAlignY("middle");

    var addButton = new qx.ui.form.Button("Add Task");
    header.add(addButton);

    var spacer = new qx.ui.core.Widget();
    header.add(spacer, { flex: 1 });

    var searchField = new qx.ui.form.TextField();
    searchField.setWidth(200);
    searchField.setPlaceholder("Search Tasks...");
    header.add(searchField);

    // Table
    var tableModel = new qx.ui.table.model.Simple();
    tableModel.setColumns(["Task", "Due Date", "Priority"]);
    tableModel.setData([
      ["Sample Task 1", "2024-12-01", "High"],
      ["Sample Task 2", "2024-12-05", "Medium"],
    ]);
    var table = new qx.ui.table.Table(tableModel);

    // Render
    layout.add(header);
    layout.add(table, { flex: 1 });

    this.add(layout, { edge: 0 });
  },

  properties: {},

  members: {},
});
