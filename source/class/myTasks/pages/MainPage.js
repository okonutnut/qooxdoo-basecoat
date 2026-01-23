qx.Class.define("myTasks.pages.MainPage", {
  extend: qx.ui.container.Composite,

  construct: function () {
    this.base(arguments);

    // Set the layout for the entire page
    this.setLayout(new qx.ui.layout.Canvas());

    // Pages
    var loginPage = new myTasks.pages.LoginPage();

    var mainLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));

    // Header
    var header = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));
    header.setDecorator("main");
    header.setAlignY("middle");

    var title = new qx.ui.basic.Label("My Tasks");
    title.setFont(
      new qx.bom.Font().set({
        size: 24,
        bold: true,
      }),
    );
    header.add(title);

    var spacer = new qx.ui.core.Widget();
    header.add(spacer, { flex: 1 }); // this will push items apart

    var logoutButton = new qx.ui.form.Button("Logout");
    // var logoutButton = new myTasks.components.ui.Button("Logout", "secondary", "sm");
    header.add(logoutButton);

    // Tab View
    var tabView = new qx.ui.tabview.TabView();

    var todoTab = new qx.ui.tabview.Page("To Do");
    var todoPage = new myTasks.pages.ToDoPage();
    todoTab.setLayout(new qx.ui.layout.VBox(10));
    todoTab.add(todoPage);
    tabView.add(todoTab);

    var inProgressTab = new qx.ui.tabview.Page("In Progress");
    tabView.add(inProgressTab);

    var doneTab = new qx.ui.tabview.Page("Done");
    tabView.add(doneTab);

    // Justify tabs: make each tab button flex equally
    var tabBar = tabView.getChildControl("bar");
    tabBar.setLayout(new qx.ui.layout.HBox(0));

    tabBar.getChildren().forEach(function (button) {
      button.setAllowGrowX(true); // allow horizontal growth
      button.setWidth(null); // unset fixed width
    });

    // Listeners
    logoutButton.addListener("execute", function () {
      this.getRoot().setCurrent(loginPage);
    });

    // Render
    mainLayout.add(header);
    mainLayout.add(tabView, { flex: 1 });

    this.add(mainLayout, { edge: 0 });
  },
});
