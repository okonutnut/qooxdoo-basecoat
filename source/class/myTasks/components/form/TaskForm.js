qx.Class.define("myTasks.components.form.TaskForm", {
  extend: qx.ui.container.Composite,

  construct(taskObj) {
    this.base(arguments);
    this.setLayout(new qx.ui.layout.Canvas());

    const session = myTasks.globals.Session.getInstance();

    const isAdd = !taskObj;
    const isTodo = taskObj?.status === 0;

    const formLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    const taskLabel = new qx.ui.basic.Label("Task Name:");
    const taskField = new qx.ui.form.TextField();
    taskField.setValue(taskObj ? taskObj.name : "");
    taskField.setEnabled(isTodo || isAdd);

    const dueDateLabel = new qx.ui.basic.Label("Due Date:");
    const dueDateDateField = new qx.ui.form.DateField();
    const dueDateValue = taskObj ? new Date(taskObj.due_date) : null;
    dueDateDateField.setValue(dueDateValue);
    dueDateDateField.setEnabled(isTodo || isAdd);

    const priorityLabel = new qx.ui.basic.Label("Priority:");
    const prioritySelectBox = new qx.ui.form.SelectBox();
    const priority = taskObj ? taskObj.priority_level : null;
    prioritySelectBox.setValue(priority);
    prioritySelectBox.setEnabled(isTodo || isAdd);

    const lowPriority = new qx.ui.form.ListItem("Low");
    const mediumPriority = new qx.ui.form.ListItem("Medium");
    const highPriority = new qx.ui.form.ListItem("High");
    prioritySelectBox.add(lowPriority);
    prioritySelectBox.add(mediumPriority);
    prioritySelectBox.add(highPriority);

    const submitButton = new qx.ui.form.Button("Submit");
    const markAsInProgressButton = new qx.ui.form.Button("Mark as In Progress");
    const markAsDoneButton = new qx.ui.form.Button("Mark as Done");
    const deleteButton = new qx.ui.form.Button("Delete");

    formLayout.add(taskLabel);
    formLayout.add(taskField);
    formLayout.add(dueDateLabel);
    formLayout.add(dueDateDateField);
    formLayout.add(priorityLabel);
    formLayout.add(prioritySelectBox);
    if (isAdd) {
      formLayout.add(submitButton);
    } else {
      if (taskObj?.status === 0) {
        formLayout.add(submitButton);
        formLayout.add(markAsInProgressButton);
        formLayout.add(deleteButton);
      } else if (taskObj?.status === 1) {
        formLayout.add(markAsDoneButton);
      } else if (taskObj?.status === 2) {
        formLayout.add(deleteButton);
      }
    }

    // API functions
    const createTask = async (task) => {
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

        this.setIsAdded(true);
        taskField.setValue("");
        dueDateDateField.setValue(null);
        prioritySelectBox.setSelection([]);
        this.setIsAdded(false);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    };

    const updateTask = async (id, task) => {
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

        this.setIsAdded(true);
        this.setIsAdded(false);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    };

    const deleteTask = async (id) => {
      try {
        const response = await fetch(
          `http://localhost:3000/tasks.php?id=${id}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) {
          console.error("Failed to delete task");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.setIsAdded(true);
        this.setIsAdded(false);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    };

    const updateTaskStatus = async (id, newStatus) => {
      try {
        const response = await fetch(
          `http://localhost:3000/tasks.php?id=${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          },
        );
        if (!response.ok) {
          console.error("Failed to update status");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.setIsAdded(true);
        this.setIsAdded(false);
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };

    // Listeners
    submitButton.addListener(
      "execute",
      () => {
        const user_id = session ? session.getValue().user.id : null;
        const taskName = taskField.getValue();
        const dueDate = dueDateDateField.getValue();
        const priority = prioritySelectBox.getSelection()[0].getLabel();
        if (taskName && dueDate && priority) {
          const payload = {
            code: "",
            name: taskName,
            due_date: dueDate.toISOString().split("T")[0],
            priority_level: priority,
            status: taskObj?.status || 0,
            user_id: user_id,
          };
          if (taskObj?.id !== undefined) {
            updateTask(taskObj.id, payload);
          } else {
            createTask(payload);
          }
        }
      },
      this,
    );

    deleteButton.addListener(
      "execute",
      () => {
        if (!isAdd && taskObj?.id !== undefined) {
          deleteTask(taskObj.id);
        }
      },
      this,
    );

    markAsInProgressButton.addListener(
      "execute",
      async () => {
        if (!isAdd && taskObj?.id !== undefined) {
          await updateTaskStatus(taskObj.id, 1);
        }
      },
      this,
    );

    markAsDoneButton.addListener(
      "execute",
      async () => {
        if (!isAdd && taskObj?.id !== undefined) {
          await updateTaskStatus(taskObj.id, 2);
        }
      },
      this,
    );

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