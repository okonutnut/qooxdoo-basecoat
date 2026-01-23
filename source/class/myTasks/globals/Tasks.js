qx.Class.define("myTasks.globals.Tasks", {
  type: "singleton",
  extend: qx.core.Object,

  properties: {
    value: {
      init: [
        ["do the dishes", "2024-12-01", "High", 0],
        ["take out the trash", "2024-12-05", "Medium", 0],
        ["do the laundry", "2024-12-05", "High", 1],
      ],
      nullable: false,
      check: "Array",
    },
  },

  members: {
    incrementStatus(rowIndex) {
      this.getValue()[rowIndex][3] = this.getValue()[rowIndex][3] + 1;
    }
  },
});
