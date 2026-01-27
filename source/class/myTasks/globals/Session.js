qx.Class.define("myTasks.globals.Session", {
  type: "singleton",
  extend: qx.core.Object,

  properties: {
    value: {
      init: { user: {} },
      nullable: false,
      check: "Object",
    },
  },

  members: {
    setUserSession(user) {
      this.getValue().user = user;
    },
    clearUserSession() {
      this.getValue().user = {};
    },
  },
});
