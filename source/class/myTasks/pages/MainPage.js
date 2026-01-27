qx.Class.define("myTasks.pages.MainPage", {
  extend: qx.ui.container.Composite,

  construct() {
    this.base(arguments);
    this.setLayout(new qx.ui.layout.Canvas());

    // User Session
    var session = myTasks.globals.Session.getInstance();

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

    // Toolbar always visible, menu button shows user name if available
    var toolbar = new qx.ui.toolbar.ToolBar();
    toolbar.setBackgroundColor("transparent");

    var menu = new qx.ui.menu.Menu();
    var profileButton = new qx.ui.menu.Button("My Profile");
    var logoutButton = new qx.ui.menu.Button("Logout");
    menu.add(profileButton);
    menu.add(logoutButton);

    // Add dropdown icon beside label
    var menuButton = new qx.ui.toolbar.MenuButton("", null, menu);
    toolbar.add(menuButton);
    header.add(toolbar);

    // Tab View
    var tabView = new qx.ui.tabview.TabView();

    var todoTab = new qx.ui.tabview.Page("To Do");
    var todoPage = new myTasks.pages.ToDoPage(session.getValue());
    todoTab.setLayout(new qx.ui.layout.VBox(10));
    todoTab.add(todoPage);
    tabView.add(todoTab);

    var inProgressTab = new qx.ui.tabview.Page("In Progress");
    var inProgressPage = new myTasks.pages.InProgressPage(session.getValue());
    inProgressTab.setLayout(new qx.ui.layout.VBox(10));
    inProgressTab.add(inProgressPage);
    tabView.add(inProgressTab);

    var doneTab = new qx.ui.tabview.Page("Done");
    var donePage = new myTasks.pages.DonePage(session.getValue());
    doneTab.setLayout(new qx.ui.layout.VBox(10));
    doneTab.add(donePage);
    tabView.add(doneTab);

    // Profile Page
    var profilePage = new myTasks.pages.ProfilePage(session.getValue());

    // Store references for cleanup
    this._menu = menu;
    this._profileButton = profileButton;
    this._logoutButton = logoutButton;
    this._menuButton = menuButton;

    // Render
    mainLayout.add(header);
    mainLayout.add(tabView, { flex: 1 });
    mainLayout.add(profilePage, { flex: 1 });

    profilePage.exclude();

    this.add(mainLayout, { edge: 0 });

    // Listeners
    // Start
    this.addListenerOnce(
      "appear",
      function () {
        if (session == null) {
          this.fireEvent("logout");
          return;
        }

        if (session.getValue().user?.name) {
          menuButton.setLabel(session.getValue().user.name);
        }

        // Ensure the menu is properly initialized
        if (!menu.isDisposed()) {
          menu.removeAll();
          menu.add(profileButton);
          menu.add(logoutButton);
        }
      },
      this,
    );

    // Open Profile Form
    profileButton.addListener(
      "execute",
      function () {
        tabView.exclude();
        profilePage.show();
      },
      this,
    );

    // Close Profile Form
    profilePage.addListener("changeCloseForm", function (e) {
      if (e.getData() === true) {
        tabView.show();
        profilePage.exclude();
      }
    });

    // Logout
    logoutButton.addListener(
      "execute",
      function () {
        myTasks.globals.Session.getInstance().clearUserSession();
        this.fireEvent("logout");
      },
      this,
    );

    // Clean up event listeners and menu on dispose
    this.addListener("dispose", function () {
      if (profileButton && !profileButton.isDisposed()) {
        profileButton.removeAllListeners();
      }

      if (logoutButton && !logoutButton.isDisposed()) {
        logoutButton.removeAllListeners();
      }

      if (menu && !menu.isDisposed()) {
        menu.removeAll();
      }
    });
  },

  events: {
    logout: "qx.event.type.Event",
  },
});
