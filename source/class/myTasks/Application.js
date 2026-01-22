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

      const button = new myTasks.components.ui.Button(
        "Click me",
        "primary",
        "lg",
      );

      // Document is the application root
      const doc = this.getRoot();

      // Add button to document at fixed coordinates
      doc.add(button, { left: 100, top: 100, edge: 0 });

      // Attach event listener
      button.addListener("execute", () => {
        alert("Button clicked!");
      });
    },
  },
});
