qx.Class.define("myTasks.pages.ToDoPage", {
  extend: qx.ui.container.Composite,

  construct: function (session) {
    this.base(arguments);
    this.setLayout(new qx.ui.layout.Canvas());

    var layout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    var headerLayout = new qx.ui.layout.HBox(10);
    headerLayout.setAlignY("middle");
    var header = new qx.ui.container.Composite(headerLayout);

    var addButton = new qx.ui.form.Button("Add Task");
    header.add(addButton);

    var refreshButton = new qx.ui.form.Button("Refresh");
    header.add(refreshButton);

    var spacer = new qx.ui.core.Spacer();
    header.add(spacer, { flex: 1 });

    var searchField = new qx.ui.form.TextField();
    searchField.setPlaceholder("Search Tasks...");
    searchField.setWidth(200);
    header.add(searchField);

    var tableModel = new qx.ui.table.model.Simple();
    tableModel.setColumns(
      ["ID", "Task", "Due Date", "Priority", "Status"],
      ["id", "name", "due_date", "priority_level", "status"],
    );

    var table = new myTasks.components.DataTable(tableModel);

    // Window
    var window = new myTasks.components.Window("Task Details");
    window.setLayout(new qx.ui.layout.Canvas());

    // Render
    layout.add(header);
    layout.add(table, { flex: 1 });

    this.add(layout, { edge: 0 });

    // Functions
    async function FetchData() {
      try {
        if (!session.user.id) {
          console.error("User session is invalid or missing.");
          tableModel.setData([]);
          return [];
        }

        const url =
          "http://localhost:3000/tasks.php?status=0&user_id=" + session.user.id;
        const response = await fetch(url);

        if (!response.ok) {
          tableModel.setData([]);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Map to table model format (include status)
        const tableData = data.map((task) => [
          task.id,
          task.name,
          task.due_date,
          task.priority_level,
          task.status,
        ]);

        tableModel.setData(tableData);

        return tableData;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        tableModel.setData([]);
        return [];
      }
    }
    FetchData();

    // Listeners
    addButton.addListener(
      "execute",
      () => {
        var addForm = new myTasks.components.form.TaskForm();
        window.add(addForm, { edge: 0 });

        // Update table on task addition
        addForm.addListener(
          "changeIsAdded",
          () => {
            refreshButton.execute();
            window.close();
            window.removeAll();
          },
          this,
        );

        window.openCentered();
      },
      this,
    );

    // Update form when a table row is clicked
    table.addListener(
      "cellTap",
      (e) => {
        var row = e.getRow();
        var model = table.getTableModel();

        var id = model.getValue(0, row);
        var name = model.getValue(1, row);
        var due_date = model.getValue(2, row);
        var priority = model.getValue(3, row);
        var status = model.getValue(4, row);

        // Create form with pre-filled data
        var taskObj = {
          name,
          due_date,
          priority,
          status,
          id,
        };
        var editForm = new myTasks.components.form.TaskForm(taskObj);
        window.removeAll();
        window.add(editForm, { edge: 0 });

        // Update table on task modification
        editForm.addListener(
          "changeIsAdded",
          () => {
            refreshButton.execute();
            window.close();
            window.removeAll();
          },
          this,
        );

        window.openCentered();
      },
      this,
    );

    // Refresh
    refreshButton.addListener(
      "execute",
      async () => {
        await FetchData(); // await ensures the table is updated after fetch
      },
      this,
    );

    // Search
    searchField.addListener(
      "input",
      async () => {
        const filter = searchField.getValue().toLowerCase();
        const allTasks = await FetchData(); // get current data

        const filteredData = allTasks.filter((task) =>
          task[1].toLowerCase().includes(filter),
        );

        tableModel.setData(filteredData);
      },
      this,
    );
  },

  properties: {},

  members: {},
});
