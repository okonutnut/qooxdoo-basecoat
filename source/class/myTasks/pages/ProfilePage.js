qx.Class.define("myTasks.pages.ProfilePage", {
  extend: qx.ui.container.Composite,

  construct: function (session) {
    this.base(arguments);
    this.setLayout(new qx.ui.layout.Canvas());

    var layout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    // Page Title
    var pageTitle = new qx.ui.basic.Label("Profile Page");
    pageTitle.setFont(
      new qx.bom.Font().set({
        size: 20,
        bold: true,
      }),
    );

    // Form
    var userProfileForm = new myTasks.components.form.UserProfileForm(session);

    // Cancel Button Listener to close the form
    var closeButton = new qx.ui.form.Button("Close");

    // Render
    layout.add(pageTitle);
    layout.add(userProfileForm);
    layout.add(closeButton);

    this.add(layout, { edge: 10, right: "70%" });

    // Listeners
    closeButton.addListener(
      "execute",
      function () {
        this.setCloseForm(true);
        this.setCloseForm(false);
      },
      this,
    );
  },

  properties: {
    closeForm: {
      init: false,
      check: "Boolean",
      event: "changeCloseForm",
    },
  },

  members: {},
});
