qx.Class.define("myTasks.pages.InProgressPage", {
  extend: qx.ui.container.Composite,

  construct: function (session) {
    this.base(arguments);
    this.setLayout(new qx.ui.layout.Canvas());

    var layout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    var headerLayout = new qx.ui.layout.HBox(10);
    headerLayout.setAlignY("middle");
    var header = new qx.ui.container.Composite(headerLayout);

    var refreshButton = new qx.ui.form.Button("Refresh");
    header.add(refreshButton);

    var spacer = new qx.ui.core.Spacer();
    header.add(spacer, { flex: 1 });

    var searchField = new qx.ui.form.TextField();
    searchField.setPlaceholder("Search Tasks...");
    searchField.setWidth(200);
    header.add(searchField);

    // Table
    var tableModel = new qx.ui.table.model.Simple();
    tableModel.setColumns(
      ["ID", "Task", "Due Date", "Priority", "Status"],
      ["id", "name", "due_date", "priority_level", "status"],
    );
    tableModel.setData([]);
    var table = new myTasks.components.DataTable(tableModel);

    // Window
    var window = new myTasks.components.Window("Task Details");
    window.setLayout(new qx.ui.layout.Canvas());

    // Render
    layout.add(header);
    layout.add(table, { flex: 1 });
    this.add(layout, { edge: 0 });

    // Fetch tasks from API
    async function fetchInProgressTasks() {
      try {
        if (!session) {
          tableModel.setData([]);
          return [];
        }

        const response = await fetch(
          "http://localhost:3000/tasks.php?status=1&user_id=" + session.user.id,
        );

        if (!response.ok) {
          tableModel.setData([]);
          throw new Error("Failed to fetch in-progress tasks");
        }

        const data = await response.json();
        // Map to table model format
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
        console.error(error);
        tableModel.setData([]);
        return [];
      }
    }

    // Initial load
    fetchInProgressTasks();

    // Listeners
    // Update form when a table row is clicked
    table.addListener(
      "cellTap",
      (e) => {
        var row = e.getRow();
        var model = table.getTableModel();

        var id = model.getValue(0, row);
        var taskName = model.getValue(1, row);
        var dueDate = model.getValue(2, row);
        var priority = model.getValue(3, row);
        var status = model.getValue(4, row);

        // Create form with pre-filled data
        var taskObj = {
          taskName,
          dueDate,
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
          async () => {
            await fetchInProgressTasks();
            window.close();
            window.removeAll();
          },
          this,
        );
        window.openCentered();
      },
      this,
    );

    // Refresh button listener
    refreshButton.addListener(
      "execute",
      async () => {
        await fetchInProgressTasks();
      },
      this,
    );

    // Search functionality
    searchField.addListener(
      "input",
      async () => {
        var filter = searchField.getValue().toLowerCase();
        const allTasks = await fetchInProgressTasks();
        var filteredData = allTasks.filter((row) =>
          row[0].toLowerCase().includes(filter),
        );
        tableModel.setData(filteredData);
      },
      this,
    );
  },

  properties: {},

  members: {},
});
