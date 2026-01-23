qx.Class.define("myTasks.components.Window", {
    extend: qx.ui.window.Window,

    construct(title) {
        this.base(arguments, title);

        this.set({
            width: 400,
            height: 300,
            modal: true,
            showClose: true,
            showMaximize: false,
            showMinimize: false,
            resizable: false,
            movable: false
        });
    },

    members: {
        openCentered() {
            if (!this.getLayoutParent()) {
                qx.core.Init.getApplication().getRoot().add(this);
            }

            this.center();
            this.open();
        }
    }
});
