qx.Class.define("myTasks.components.DataTable", {
  extend: qx.ui.table.Table,

  construct: function (tableModel) {
    // Pass model to parent constructor
    this.base(arguments, tableModel);

    // Table size
    this.set({
      width: 700,
      height: 400,
    });

    // Column widths
    var columnModel = this.getTableColumnModel();
    columnModel.setColumnWidth(0, 350);
    columnModel.setColumnWidth(1, 150);
    columnModel.setColumnWidth(2, 150);
    
    this.addListener("cellTap", function (e) {
      var row = e.getRow();
      var col = e.getColumn();
      var model = this.getTableModel();
      var value = null;
      if (model && typeof model.getValue === "function") {
        value = model.getValue(col, row);
      }
      var selected = { row: row, column: col, value: value };
      try {
        if (typeof model.getRowData === "function") {
          selected.rowData = model.getRowData(row);
        }
      } catch (ex) {}
      this.setSelectedRow(selected);
    }, this);
  },

  properties: {
    selectedRow: {
      check: "Object",
      init: {},
      event: "changeSelectedRow",
    },
  }
});