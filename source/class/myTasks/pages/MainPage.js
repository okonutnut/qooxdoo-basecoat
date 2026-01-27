qx.Class.define("myTasks.pages.MainPage", {
  extend: qx.ui.container.Composite,

  construct() {
    this.base(arguments);
    this.setLayout(new qx.ui.layout.Canvas());

    // User Session
    const session = myTasks.globals.Session.getInstance();

    // Pages
    const mainLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    // Header
    const header = new qx.ui.container.Composite(
      new qx.ui.layout.HBox(10, "center"),
    );
    header.setDecorator("main");

    const title = new qx.ui.basic.Label("My Tasks");
    title.setFont(
      new qx.bom.Font().set({
        size: 24,
        bold: true,
      }),
    );
    header.add(title);

    const spacer = new qx.ui.core.Spacer();
    header.add(spacer, { flex: 1 });

    // Toolbar always visible, menu button shows user name if available
    const toolbar = new qx.ui.toolbar.ToolBar();
    toolbar.setBackgroundColor("transparent");

    const menu = new qx.ui.menu.Menu();
    const profileButton = new qx.ui.menu.Button("My Profile");
    const logoutButton = new qx.ui.menu.Button("Logout");
    menu.add(profileButton);
    menu.add(logoutButton);

    const menuButton = new qx.ui.toolbar.MenuButton("", null, menu);
    toolbar.add(menuButton);
    header.add(toolbar);

    // Tab View
    const tabView = new qx.ui.tabview.TabView();

    // Create tabs
    const tabs = [
      { label: "To Do", pageClass: myTasks.tabs.ToDoTab },
      { label: "In Progress", pageClass: myTasks.tabs.InProgressTab },
      { label: "Done", pageClass: myTasks.tabs.DoneTab },
    ];

    tabs.forEach(({ label, pageClass }) => {
      const tabPage = new qx.ui.tabview.Page(label);
      const page = new pageClass(session.getValue());
      tabPage.setLayout(new qx.ui.layout.VBox(10));
      tabPage.add(page);
      tabView.add(tabPage);
    });

    // Profile Page
    const profilePage = new myTasks.pages.ProfilePage(session.getValue());

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
    this.addListenerOnce(
      "appear",
      function () {
        const sessionValue = session.getValue();
        if (!sessionValue || !sessionValue.user) {
          this.fireEvent("logout");
          return;
        }

        if (sessionValue.user?.name) {
          menuButton.setLabel(sessionValue.user.name);
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