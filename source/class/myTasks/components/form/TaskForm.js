qx.Class.define("myTasks.components.form.TaskForm", {
  extend: qx.ui.container.Composite,

  construct: function (task, dueDate, priority, status, rowIndex) {
    this.base(arguments);

    this.setLayout(new qx.ui.layout.Canvas());

    var isAdd =
      !task && !dueDate && !priority && !status && rowIndex === undefined;
    var isNotToDo = status === 1 || status === 2;

    var formLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    var taskLabel = new qx.ui.basic.Label("Task Name:");
    var taskField = new qx.ui.form.TextField();
    taskField.setValue(task || "");
    taskField.setEnabled(!isNotToDo);

    var dueDateLabel = new qx.ui.basic.Label("Due Date:");
    var dueDateDateField = new qx.ui.form.DateField();
    var dueDateValue = dueDate ? new Date(dueDate) : null;
    dueDateDateField.setValue(dueDateValue);
    dueDateDateField.setEnabled(!isNotToDo);

    var priorityLabel = new qx.ui.basic.Label("Priority:");
    var prioritySelectBox = new qx.ui.form.SelectBox();
    prioritySelectBox.setValue(priority || "");
    prioritySelectBox.setEnabled(!isNotToDo);

    var lowPriority = new qx.ui.form.ListItem("Low");
    var mediumPriority = new qx.ui.form.ListItem("Medium");
    var highPriority = new qx.ui.form.ListItem("High");
    prioritySelectBox.add(lowPriority);
    prioritySelectBox.add(mediumPriority);
    prioritySelectBox.add(highPriority);

    var submitButton = new qx.ui.form.Button("Submit");
    var markAsInProgressButton = new qx.ui.form.Button("Mark as In Progress");
    var markAsDoneButton = new qx.ui.form.Button("Mark as Done");
    var deleteButton = new qx.ui.form.Button("Delete");
    deleteButton.set({
      backgroundColor: "#ff4d4d",
    })

    formLayout.add(taskLabel);
    formLayout.add(taskField);
    formLayout.add(dueDateLabel);
    formLayout.add(dueDateDateField);
    formLayout.add(priorityLabel);
    formLayout.add(prioritySelectBox);
    if (isAdd) {
      formLayout.add(submitButton);
    } else {
      if (status === 0) {
        formLayout.add(submitButton);
        formLayout.add(markAsInProgressButton);
        formLayout.add(deleteButton);
      } else if (status === 1) {
        formLayout.add(markAsDoneButton);
      } else if (status === 2) {
        formLayout.add(deleteButton);
      }
    }

    // Listeners
    submitButton.addListener(
      "execute",
      () => {
        var user_id = JSON.parse(localStorage.getItem("user")).id;
        var taskName = taskField.getValue();
        var dueDate = dueDateDateField.getValue();
        var priority = prioritySelectBox.getSelection()[0].getLabel();
        if (taskName && dueDate && priority) {
          var payload = {
            code: "",
            name: taskName,
            due_date: dueDate.toISOString().split("T")[0],
            priority_level: priority,
            status: status || 0,
            user_id: user_id,
          };
          if (rowIndex !== undefined) {
            // Update existing task
            UpdateTask.call(this, rowIndex, payload);
          } else {
            // Create new task
            CreateTask.call(this, payload);
          }
        }
      },
      this,
    );

    deleteButton.addListener(
      "execute",
      () => {
        if (!isAdd && rowIndex !== undefined) {
          DeleteTask.call(this, rowIndex);
        }
      },
      this,
    );

    // Mark as In Progress
    markAsInProgressButton.addListener("execute", async () => {
      if (!isAdd && rowIndex !== undefined) {
        await UpdateTaskStatus(rowIndex, 1); // 1 = In Progress
      }
    }, this);

    // Mark as Done
    markAsDoneButton.addListener("execute", async () => {
      if (!isAdd && rowIndex !== undefined) {
        await UpdateTaskStatus(rowIndex, 2); // 2 = Done
      }
    }, this);

    const UpdateTaskStatus = async (id, newStatus) => {
      try {
        const response = await fetch(`http://localhost:3000/tasks.php?id=${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) {
          console.error("Failed to update status");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (response.ok) {
          this.setIsAdded(true);
          this.setIsAdded(false);
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };

    async function CreateTask(task) {
      try {
        const response = await fetch("http://localhost:3000/tasks.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });
        if (!response.ok) {
          console.error("Failed to create task");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (response.ok) {
          this.setIsAdded(true);
          taskField.setValue("");
          dueDateDateField.setValue(null);
          prioritySelectBox.setSelection([]);

          this.setIsAdded(false);
        }
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }

    async function UpdateTask(id, task) {
      try {
        const response = await fetch(
          `http://localhost:3000/tasks.php?id=${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
          },
        );
        if (!response.ok) {
          console.error("Failed to update task");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (response.ok) {
          this.setIsAdded(true);
          this.setIsAdded(false);
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }

    // Delete function
    async function DeleteTask(id) {
      try {
        const response = await fetch(`http://localhost:3000/tasks.php?id=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          console.error("Failed to delete task");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (response.ok) {
          this.setIsAdded(true);
          this.setIsAdded(false);
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }

    this.add(formLayout, { edge: 0 });
  },

  properties: {
    isAdded: {
      init: false,
      check: "Boolean",
      event: "changeIsAdded",
    },
  },

  members: {},
});
