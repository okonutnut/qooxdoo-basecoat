qx.Class.define("myTasks.pages.ProfilePage", {
  extend: qx.ui.container.Composite,

  construct(session) {
    this.base(arguments);
    this.setLayout(new qx.ui.layout.Canvas());

    const layout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    const pageTitle = new qx.ui.basic.Label("Profile Page");
    pageTitle.setFont(
      new qx.bom.Font().set({
        size: 20,
        bold: true,
      }),
    );

    const userProfileForm = new myTasks.components.form.UserProfileForm(session);

    const closeButton = new qx.ui.form.Button("Close");

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