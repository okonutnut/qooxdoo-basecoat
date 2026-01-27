qx.Class.define("myTasks.pages.RegisterPage", {
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

    const title = new qx.ui.basic.Label("My Tasks");
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

    const fullnameField = new qx.ui.form.TextField();
    fullnameField.setPlaceholder("Fullname");
    formContainer.add(fullnameField);

    const usernameField = new qx.ui.form.TextField();
    usernameField.setPlaceholder("Username");
    formContainer.add(usernameField);

    const passwordField = new qx.ui.form.PasswordField();
    passwordField.setPlaceholder("Password");
    formContainer.add(passwordField);

    const registerButton = new qx.ui.form.Button("Register");
    formContainer.add(registerButton);

    // Switch to Login button
    const switchToLoginButton = new qx.ui.form.Button(
      "Already have an account? Login",
    );
    switchToLoginButton.set({ alignX: "center" });
    formContainer.add(switchToLoginButton);

    const messageLabel = new qx.ui.basic.Label("");
    messageLabel.set({
      textColor: "red",
      alignX: "center",
    });
    formContainer.add(messageLabel);

    // Render
    this._add(formContainer, { left: "50%", top: "50%" });

    // Register function
    async function registerFunction(fullname, username, password) {
      try {
        const response = await fetch("http://localhost:3000/register.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullname, username, password }),
        });

        const result = await response.json();

        if (response.ok && result.user && result.token) {
          var session = myTasks.globals.Session.getInstance();
          session.setUserSession(result.user);

          messageLabel.setValue("Registration successful! Redirecting...");
          setTimeout(() => {
            const app = qx.core.Init.getApplication();
            if (app && app.showMainPage) {
              app.showMainPage();
            } else {
              window.location.reload();
            }
          }, 1200);
        } else if (result.error) {
          messageLabel.setValue(result.error);
        } else {
          messageLabel.setValue("Registration failed. Please try again.");
        }
      } catch (error) {
        messageLabel.setValue("Registration failed. Please try again.");
        console.error("Register error:", error);
      }
    }

    // Listeners
    this.addListenerOnce(
      "appear",
      function () {
        myTasks.globals.Session.getInstance().clearUserSession();
      },
      this,
    );

    registerButton.addListener("execute", () => {
      const fullname = fullnameField.getValue();
      const username = usernameField.getValue();
      const password = passwordField.getValue();

      if (!fullname || !username || !password) {
        messageLabel.setValue("All fields are required.");
        return;
      }
      registerFunction.call(this, fullname, username, password);
    });

    // Switch to login page event
    switchToLoginButton.addListener(
      "execute",
      function () {
        this.fireEvent("switchToLogin");
      },
      this,
    );

    // Center form container
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
  events: {
    switchToLogin: "qx.event.type.Event",
  },
});
