qx.Class.define("myTasks.components.DataTable", {
  extend: qx.ui.table.Table,

  construct(tableModel) {
    this.base(arguments, tableModel);

    var columnModel = this.getTableColumnModel();

    // Make all columns share space equally
    var columnCount = tableModel.getColumnCount();
    for (var i = 0; i < columnCount; i++) {
      columnModel.setColumnFlex(i, 1);
    }

    // Optional but recommended
    columnModel.setBehavior(qx.ui.table.columnmodel.Resize);
  }
});
