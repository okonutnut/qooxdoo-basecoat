qx.Class.define("myTasks.pages.LoginPage", {
  extend: qx.ui.container.Composite,

  construct() {
    this.base(arguments);

    this._setLayout(new qx.ui.layout.Canvas());

    const formContainer = new qx.ui.container.Composite(
      new qx.ui.layout.VBox(10),
    );
    formContainer.setWidth(250);

    const logo = new qx.ui.basic.Image("myTasks/logo.png");
    logo.set({
      width: 100,
      height: 100,
      scale: true,
      alignX: "center",
      alignY: "middle",
    });
    formContainer.add(logo);

    const title = new qx.ui.basic.Label("Task Manager");
    title.setFont(
      new qx.bom.Font().set({
        size: 24,
        bold: true,
      }),
    );
    title.set({
      alignX: "center",
      alignY: "middle",
    });
    formContainer.add(title);

    const usernameField = new qx.ui.form.TextField();
    usernameField.setPlaceholder("Username");
    formContainer.add(usernameField);

    const passwordField = new qx.ui.form.PasswordField();
    passwordField.setPlaceholder("Password");
    formContainer.add(passwordField);

    const loginButton = new qx.ui.form.Button("Login");
    formContainer.add(loginButton);

    const messageLabel = new qx.ui.basic.Label("");
    messageLabel.set({
      alignX: "center",
      textColor: "red",
    });
    formContainer.add(messageLabel);

    // Render
    this._add(formContainer, { left: "50%", top: "50%" });

    // Listeners
    loginButton.addListener("execute", () => {
      const username = usernameField.getValue();
      const password = passwordField.getValue();

      if (username != null && password !== null) {
        this.setLoggedIn(true);
        usernameField.setValue("");
        passwordField.setValue("");
        messageLabel.setValue("");
      } else {
        this.setLoggedIn(false);
        messageLabel.setValue("Invalid username and password.");
      }
    });

    formContainer.addListenerOnce(
      "appear",
      function () {
        var bounds = formContainer.getBounds();
        formContainer.setLayoutProperties({
          left: Math.round((this.getBounds().width - bounds.width) / 2),
          top: Math.round((this.getBounds().height - bounds.height) / 2),
        });
      },
      this,
    );
  },

  properties: {
    loggedIn: {
      check: "Boolean",
      init: false,
      event: "changeLoggedIn",
    },
  },

  members: {},
});
