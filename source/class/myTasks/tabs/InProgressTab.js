qx.Class.define("myTasks.tabs.InProgressTab", {
  extend: qx.ui.container.Composite,

  construct(session) {
    this.base(arguments);
    this.setLayout(new qx.ui.layout.Canvas());

    const layout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    const headerLayout = new qx.ui.layout.HBox(10);
    headerLayout.setAlignY("middle");
    const header = new qx.ui.container.Composite(headerLayout);

    const refreshButton = new qx.ui.form.Button("Refresh");
    header.add(refreshButton);

    const spacer = new qx.ui.core.Spacer();
    header.add(spacer, { flex: 1 });

    const searchField = new qx.ui.form.TextField();
    searchField.setPlaceholder("Search Tasks...");
    searchField.setWidth(200);
    header.add(searchField);

    const tableModel = new qx.ui.table.model.Simple();
    tableModel.setColumns(
      ["ID", "Task", "Due Date", "Priority", "Status"],
      ["id", "name", "due_date", "priority_level", "status"],
    );
    tableModel.setData([]);
    const table = new myTasks.components.DataTable(tableModel);

    const window = new myTasks.components.Window("Task Details");
    window.setLayout(new qx.ui.layout.Canvas());

    // Render
    layout.add(header);
    layout.add(table, { flex: 1 });
    this.add(layout, { edge: 0 });

    // Fetch tasks from API
    const fetchInProgressTasks = async () => {
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
    };

    // Initial load
    fetchInProgressTasks();

    // Listeners
    table.addListener(
      "cellTap",
      (e) => {
        const row = e.getRow();
        const model = table.getTableModel();

        const id = model.getValue(0, row);
        const name = model.getValue(1, row);
        const due_date = model.getValue(2, row);
        const priority_level = model.getValue(3, row);
        const status = model.getValue(4, row);

        const taskObj = {
          name,
          due_date,
          priority_level,
          status,
          id,
        };
        const editForm = new myTasks.components.form.TaskForm(taskObj);
        window.removeAll();
        window.add(editForm, { edge: 0 });
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

    refreshButton.addListener(
      "execute",
      async () => {
        await fetchInProgressTasks();
      },
      this,
    );

    searchField.addListener(
      "input",
      async () => {
        const filter = searchField.getValue().toLowerCase();
        const allTasks = await fetchInProgressTasks();
        const filteredData = allTasks.filter((row) =>
          row[1].toLowerCase().includes(filter),
        );
        tableModel.setData(filteredData);
      },
      this,
    );
  },

  properties: {},

  members: {},
});