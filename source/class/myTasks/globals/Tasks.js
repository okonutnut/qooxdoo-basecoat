qx.Class.define("myTasks.globals.Tasks", {
  type: "singleton",
  extend: qx.core.Object,

  properties: {
    value: {
      init: [
        ["do the dishes", "2024-12-01", "High"],
        ["take out the trash", "2024-12-05", "Medium"],
      ],
      nullable: false,
      check: "Array",
    },
  },

  members: {},
});
