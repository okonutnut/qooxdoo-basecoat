qx.Class.define("myTasks.components.form.UserProfileForm", {
  extend: qx.ui.container.Composite,

  construct(session) {
    this.base(arguments);
    this.setLayout(new qx.ui.layout.Canvas());

    const formLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    const fullnameLabel = new qx.ui.basic.Label("Fullname:");
    const fullnameField = new qx.ui.form.TextField();
    fullnameField.setValue(session ? session.user.name : "");

    const usernameLabel = new qx.ui.basic.Label("Username:");
    const usernameField = new qx.ui.form.TextField();
    usernameField.setValue(session ? session.user.username : "");

    const passwordLabel = new qx.ui.basic.Label("Password:");
    const passwordField = new qx.ui.form.PasswordField();

    const confirmLabel = new qx.ui.basic.Label("Confirm Password:");
    const confirmField = new qx.ui.form.PasswordField();

    const submitButton = new qx.ui.form.Button("Submit");

    formLayout.add(fullnameLabel);
    formLayout.add(fullnameField);
    formLayout.add(usernameLabel);
    formLayout.add(usernameField);
    formLayout.add(passwordLabel);
    formLayout.add(passwordField);
    formLayout.add(confirmLabel);
    formLayout.add(confirmField);
    formLayout.add(submitButton);

    this.add(formLayout, { edge: 0 });

    // Update profile function
    const updateProfile = async (data) => {
      try {
        console.log("Updating profile with data:", data);
        const response = await fetch(
          "http://localhost:3000/users.php?id=" + data.id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: data.fullname,
              username: data.username,
              password: data.password,
            }),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          alert("Error: " + error.error);
          return;
        }

        const updatedUser = await response.json();
        alert("Profile updated successfully!");
        console.log("Updated user:", updatedUser);
      } catch (error) {
        console.error("Failed to update profile:", error);
        alert("An error occurred while updating the profile.");
      }
    };

    // Listeners
    submitButton.addListener(
      "execute",
      async function () {
        const fullname = fullnameField.getValue();
        const username = usernameField.getValue();
        const password = passwordField.getValue();
        const confirm = confirmField.getValue();

        if (password !== confirm) {
          alert("Passwords do not match!");
          return;
        }

        const payload = {
          id: session ? session.user.id : null,
          fullname,
          username,
          password,
        };

        await updateProfile(payload);
      },
      this,
    );
  },

  properties: {
    isAdded: {
      init: false,
      check: "Boolean",
      event: "changeIsAdded",
    },
  },

  members: {},
});