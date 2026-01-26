qx.Class.define("myTasks.pages.MainPage", {
  extend: qx.ui.container.Composite,

  construct: function () {
    this.base(arguments);

    // Set the layout for the entire page
    this.setLayout(new qx.ui.layout.Canvas());

    // Pages
    var mainLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    // Header
    var header = new qx.ui.container.Composite(
      new qx.ui.layout.HBox(10, "center"),
    );
    header.setDecorator("main");

    var title = new qx.ui.basic.Label("My Tasks");
    title.setFont(
      new qx.bom.Font().set({
        size: 24,
        bold: true,
      }),
    );
    header.add(title);

    var spacer = new qx.ui.core.Spacer();
    header.add(spacer, { flex: 1 });

    var user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (e) {}

    var nameLabel = new qx.ui.basic.Label();
    nameLabel.setFont(
      new qx.bom.Font().set({
        bold: true,
        size: 16,
      }),
    );
    nameLabel.setAlignY("middle");

    // Set value immediately (important!)
    if (user && user.name) {
      nameLabel.setValue("Hello, " + user.name + "!");
    }

    header.add(nameLabel);

    var logoutButton = new qx.ui.form.Button("Logout");
    header.add(logoutButton);

    // Tab View
    var tabView = new qx.ui.tabview.TabView();

    var todoTab = new qx.ui.tabview.Page("To Do");
    var todoPage = new myTasks.pages.ToDoPage();
    todoTab.setLayout(new qx.ui.layout.VBox(10));
    todoTab.add(todoPage);
    tabView.add(todoTab);

    var inProgressTab = new qx.ui.tabview.Page("In Progress");
    var inProgressPage = new myTasks.pages.InProgressPage();
    inProgressTab.setLayout(new qx.ui.layout.VBox(10));
    inProgressTab.add(inProgressPage);
    tabView.add(inProgressTab);

    var doneTab = new qx.ui.tabview.Page("Done");
    var donePage = new myTasks.pages.DonePage();
    doneTab.setLayout(new qx.ui.layout.VBox(10));
    doneTab.add(donePage);
    tabView.add(doneTab);

    // Justify tabs: make each tab button flex equally
    var tabBar = tabView.getChildControl("bar");
    tabBar.setLayout(new qx.ui.layout.HBox(0));

    tabBar.getChildren().forEach(function (button) {
      button.setAllowGrowX(true); // allow horizontal growth
      button.setWidth(null); // unset fixed width
    });

    // Listeners
    this.addListenerOnce(
      "appear",
      function () {
        if (!localStorage.getItem("token") || !localStorage.getItem("user")) {
          this.fireEvent("logout");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.name) {
          nameLabel.setValue("Hello, " + user.name + "!");
        }
      },
      this,
    );

    logoutButton.addListener(
      "execute",
      function () {
        nameLabel.setValue("");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.fireEvent("logout");
      },
      this,
    );

    // Render
    mainLayout.add(header);
    mainLayout.add(tabView, { flex: 1 });

    this.add(mainLayout, { edge: 0 });
  },

  events: {
    logout: "qx.event.type.Event",
  },
});
