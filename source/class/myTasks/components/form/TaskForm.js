qx.Class.define("myTasks.components.form.TaskForm", {
  extend: qx.ui.container.Composite,

  construct: function (task, dueDate, priority, status, rowIndex) {
    this.base(arguments);

    this.setLayout(new qx.ui.layout.Canvas());

    var isAdd = !task && !dueDate && !priority && !status && rowIndex === undefined;
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
    
    formLayout.add(taskLabel);
    formLayout.add(taskField);
    formLayout.add(dueDateLabel);
    formLayout.add(dueDateDateField);
    formLayout.add(priorityLabel);
    formLayout.add(prioritySelectBox);
    if (isAdd) {
      formLayout.add(submitButton);
    } else {
      formLayout.add(deleteButton);
      if (status === 0) {
      formLayout.add(submitButton);
      formLayout.add(markAsInProgressButton);
      } else if (status === 1) {
      formLayout.add(markAsDoneButton);
      }
    }

    // Listeners
    submitButton.addListener(
      "execute",
      () => {
        var taskName = taskField.getValue();
        var dueDate = dueDateDateField.getValue();
        var priority = prioritySelectBox.getSelection()[0].getLabel();
        if (taskName && dueDate && priority) {
          var formattedDate = qx.util.format.DateFormat.getDateInstance().format(dueDate);
          var oldTasks = myTasks.globals.Tasks.getInstance().getValue();

          if (isAdd) {
            oldTasks.push([taskName, formattedDate, priority, 0]);
          } else {
            if (rowIndex !== undefined) {
              oldTasks[rowIndex] = [taskName, formattedDate, priority, oldTasks[rowIndex][3]];
            }
            myTasks.globals.Tasks.getInstance().setValue(oldTasks);
          }
          this.setIsAdded(true);

          // Clear fields after adding
          taskField.setValue("");
          dueDateDateField.setValue(null);
          prioritySelectBox.setSelection([]);

          this.setIsAdded(false);
        }
      },
      this,
    );

    deleteButton.addListener(
      "execute",
      () => {
        if (!isAdd && rowIndex !== undefined) {
          var oldTasks = myTasks.globals.Tasks.getInstance().getValue();
          oldTasks.splice(rowIndex, 1); 
            myTasks.globals.Tasks.getInstance().setValue(oldTasks);
            this.setIsAdded(true);
            this.setIsAdded(false);
        }
      },
      this,
    );

    const updateStatus = () => {
      if (!isAdd && rowIndex !== undefined) {
        myTasks.globals.Tasks.getInstance().incrementStatus(rowIndex);
        this.setIsAdded(true);
        this.setIsAdded(false);
      }
    };

    markAsInProgressButton.addListener("execute", updateStatus, this);
    markAsDoneButton.addListener("execute", updateStatus, this);

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
