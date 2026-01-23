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
    var tasks = myTasks.globals.Tasks.getInstance().getValue();
    var tableModel = new qx.ui.table.model.Simple();
    tableModel.setColumns(["Task", "Due Date", "Priority"]);
    tableModel.setData(tasks);
    
    var table = new myTasks.components.DataTable(tableModel);
    
    // Window
    var window = new myTasks.components.Window("Task Details");
    window.setLayout(new qx.ui.layout.Canvas());

    // Render
    layout.add(header);
    layout.add(table, { flex: 1 });

    this.add(layout, { edge: 0 });

    // Listeners
    addButton.addListener("execute", () => {
      var addForm = new myTasks.components.form.TaskForm();
      window.add(addForm, { edge: 0 });
      
      // Update table on task addition
      addForm.addListener("changeIsAdded", () => {
        var updatedTasks = myTasks.globals.Tasks.getInstance().getValue();
        tableModel.setData(updatedTasks);
        window.close();
        window.removeAll();
        console.log("Task Added");
      }, this);
      
      window.openCentered();
    }, this);

    // Update form when a table row is clicked
    table.addListener("cellTap", (e) => {
      var row = e.getRow();
      var model = table.getTableModel();
      var taskName = model.getValue(0, row);
      var dueDate = model.getValue(1, row);
      var priority = model.getValue(2, row);
            
      // Create form with pre-filled data
      var editForm = new myTasks.components.form.TaskForm(taskName, dueDate, priority, row);
      window.removeAll();
      window.add(editForm, { edge: 0 });
      
      // Update table on task modification
      editForm.addListener("changeIsAdded", () => {
        var updatedTasks = myTasks.globals.Tasks.getInstance().getValue();
        tableModel.setData(updatedTasks);
        window.close();
        window.removeAll();
      }, this);
      
      window.openCentered();
    }, this);

    // Search functionality
    searchField.addListener("input", () => {
      var filter = searchField.getValue().toLowerCase();
      var tableData = myTasks.globals.Tasks.getInstance().getValue();
      var filteredData = tableData.filter((row) =>
        row[0].toLowerCase().includes(filter),
      );
      tableModel.setData(filteredData);
    }, this);
  },

  properties: {},

  members: {},
});
