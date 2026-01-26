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

    // Toolbar always visible, menu button shows user name if available
    var toolbar = new qx.ui.toolbar.ToolBar();
    toolbar.setBackgroundColor("transparent");

    var menu = new qx.ui.menu.Menu();
    var logoutButton = new qx.ui.menu.Button("Logout");
    menu.add(logoutButton);
    // Add dropdown icon beside label
    var menuButton = new qx.ui.toolbar.MenuButton(
      user && user.name ? user.name : "File",
      null,
      menu,
    );
    toolbar.add(menuButton);
    header.add(toolbar);

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
          menuButton.setLabel(user.name);
        }
      },
      this,
    );

    logoutButton.addListener(
      "execute",
      function () {
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
