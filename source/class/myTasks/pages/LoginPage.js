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

    // const usernameField = new qx.ui.form.TextField();
    const usernameField = new myTasks.basecoat.Input();
    usernameField.setPlaceholder("Username");
    formContainer.add(usernameField);

    // const passwordField = new qx.ui.form.PasswordField();
    const passwordField = new myTasks.basecoat.Input();
    passwordField.setType("password");
    passwordField.setPlaceholder("Password");
    formContainer.add(passwordField);

    const loginButton = new myTasks.basecoat.Button("Login");
    formContainer.add(loginButton);

    // const switchToRegisterButton = new qx.ui.form.Button(
    //   "Don't have an account? Register",
    // );
    const switchToRegisterButton = new myTasks.basecoat.Button(
      "Don't have an account? Register",
    );
    switchToRegisterButton.setVariant("link");
    switchToRegisterButton.setColor("blue-600");
    switchToRegisterButton.set({ alignX: "center" });
    formContainer.add(switchToRegisterButton);

    const messageLabel = new qx.ui.basic.Label("");
    messageLabel.set({
      alignX: "center",
      textColor: "red",
    });
    formContainer.add(messageLabel);

    // Render
    this._add(formContainer, { left: "50%", top: "50%" });

    // Login function
    const login = async (username, password) => {
      try {
        const response = await fetch("http://localhost:3000/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          messageLabel.setValue("Login failed. Please try again.");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.user) {
          const session = myTasks.globals.Session.getInstance();
          session.setUserSession(result.user);

          this.setLoggedIn(true);

          usernameField.setValue("");
          passwordField.setValue("");
          messageLabel.setValue("");
        } else if (result.error) {
          messageLabel.setValue(result.error);
        } else {
          messageLabel.setValue("Invalid username or password.");
        }
      } catch (error) {
        messageLabel.setValue("Login failed. Please try again.");
        console.error("Login error:", error);
      }
    };

    // Listeners
    this.addListenerOnce(
      "appear",
      function () {
        myTasks.globals.Session.getInstance().clearUserSession();
      },
      this,
    );

    loginButton.addListener("execute", () => {
      const username = usernameField.getValue();
      const password = passwordField.getValue();
      login(username, password);
    });

    switchToRegisterButton.addListener(
      "execute",
      function () {
        this.fireEvent("switchToRegister");
      },
      this,
    );

    formContainer.addListenerOnce(
      "appear",
      function () {
        const bounds = formContainer.getBounds();
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
  events: {
    switchToRegister: "qx.event.type.Event",
  },
});
