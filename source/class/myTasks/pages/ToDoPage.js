qx.Class.define("myTasks.pages.ToDoPage", {
  extend: qx.ui.container.Composite,

  construct() {
    this.base(arguments);

    this.setLayout(new qx.ui.layout.Canvas());

    var layout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    var headerLayout = new qx.ui.layout.HBox(10);
    headerLayout.setAlignY("middle");
    var header = new qx.ui.container.Composite(headerLayout);

    var addButton = new qx.ui.form.Button("Add Task");
    // var addButton = new myTasks.components.ui.Button("Add Task", "primary", "sm");
    header.add(addButton);

    var spacer = new qx.ui.core.Spacer();
    header.add(spacer, { flex: 1 });

    var searchField = new qx.ui.form.TextField();
    // var searchField = new myTasks.components.ui.TextField("Search Tasks...");
    searchField.setPlaceholder("Search Tasks...");
    searchField.setWidth(200);
    header.add(searchField);

    // Table
    var tableData = [
      ["do the dishes", "2024-12-01", "High"],
      ["take out the trash", "2024-12-05", "Medium"],
    ];
    var tableModel = new qx.ui.table.model.Simple();
    tableModel.setColumns(["Task", "Due Date", "Priority"]);
    tableModel.setData(tableData);
    var table = new qx.ui.table.Table(tableModel);
  
    // Window
    var window = new myTasks.components.Window("Task Details");

    // Listeners
    addButton.addListener("execute", () => {
      window.openCentered();
    });

    searchField.addListener("input", () => {
      var filter = searchField.getValue().toLowerCase();
      var filteredData = tableData.filter(row => row[0].toLowerCase().includes(filter));
      tableModel.setData(filteredData);
    });
    
    // Render
    layout.add(header);
    layout.add(table, { flex: 1 });
    
    this.add(layout, { edge: 0 });
  },

  properties: {},

  members: {},
});
