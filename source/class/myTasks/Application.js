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
      super.main();
      if (qx.core.Environment.get("qx.debug")) {
        qx.log.appender.Native;
        qx.log.appender.Console;
      }
      const doc = this.getRoot();

      // Pages
      let loginPage = new myTasks.pages.LoginPage();
      let registerPage = null;
      let mainPage = null;

      // Helper to setup logout handler
      const setupLogoutHandler = () => {
        mainPage.addListener("logout", () => {
          doc.removeAll();
          loginPage.setLoggedIn(false);
          if (mainPage && !mainPage.isDisposed()) {
            mainPage.dispose();
          }
          mainPage = null;
          doc.add(loginPage, { edge: 0 });
        });
      };

      // Helper to create and show main page
      const showMainPage = () => {
        doc.removeAll();
        if (mainPage && !mainPage.isDisposed()) {
          mainPage.dispose();
        }
        mainPage = new myTasks.pages.MainPage();
        doc.add(mainPage, { edge: 0 });
        setupLogoutHandler();
      };

      // Default page: show login first
      doc.add(loginPage, { edge: 0 });

      // Login success
      loginPage.addListener(
        "changeLoggedIn",
        (e) => {
          if (e.getData()) {
            showMainPage();
          }
        },
        this,
      );

      // Switch to register page
      loginPage.addListener(
        "switchToRegister",
        () => {
          doc.removeAll();

          if (!registerPage) {
            registerPage = new myTasks.pages.RegisterPage();
          }
          doc.add(registerPage, { edge: 0 });

          registerPage.addListener(
            "switchToLogin",
            () => {
              doc.removeAll();
              doc.add(loginPage, { edge: 0 });
            },
            this,
          );

          // After successful registration, redirect to main page
          registerPage.addListener("registered", () => {
            showMainPage();
          });
        },
        this,
      );
    },
  },
});