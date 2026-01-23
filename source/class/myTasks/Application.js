/* ************************************************************************

   Copyright: 2026 undefined

   License: MIT license

   Authors: undefined

************************************************************************ */

/**
 * This is the main application class of "myTasks"
 *
 * @asset(myTasks/*)
 */
qx.Class.define("myTasks.Application", {
  extend: qx.application.Standalone,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {
    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     *
     * @lint ignoreDeprecated(alert)
     */
    main() {
      // Call super class
      super.main();

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      // Document is the application root
      const doc = this.getRoot();

      // Pages
      const loginPage = new myTasks.pages.LoginPage();
      const mainPage = new myTasks.pages.MainPage();

      // Window (Modal Overlay)
      const window = new myTasks.components.Window();

      // Default page: show login first
      doc.add(mainPage, { edge: 0 });

      // Listeners
      loginPage.addListener("changeLoggedIn", (e) => {
        if (e.getData() == true) {
          doc.removeAll();
          doc.add(mainPage, { edge: 0 });
        }
      });

      // When MainPage requests logout, show login page and reset state
      mainPage.addListener("logout", () => {
        doc.removeAll();
        loginPage.setLoggedIn(false);
        doc.add(loginPage, { edge: 0 });
      });
    },
  },
});
