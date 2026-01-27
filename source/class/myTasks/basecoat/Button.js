qx.Class.define("myTasks.basecoat.Button", {
  extend: qx.ui.core.Widget,

  events: {
    "execute": "qx.event.type.Event"
  },

  properties: {
    /**
     * Button variant. Valid values: "primary" (default/empty), "secondary", 
     * "destructive", "outline", "ghost", "link", "icon"
     * @see https://basecoatui.com/components/button/
     */
    variant: {
        check: "String",
        init: "",
        apply: "_applyVariant"
    },
    /**
     * Button size. Valid values: "sm" (small), "lg" (large)
     * @see https://basecoatui.com/components/button/
     */
    size: {
        check: "String",
        init: "",
        apply: "_applySize"
    },
    /**
     * Text color class of the button. Valid Tailwind CSS text color classes (e.g., "text-white", "text-red-500", "text-blue-600")
     * Can include or omit the "text-" prefix (e.g., "white" or "text-white" both work)
     */
    color: {
        check: "String",
        init: "",
        apply: "_applyColor"
    }
  },

  construct(label) {
    super();

    // set a layout so children get measured and laid out
    this._setLayout(new qx.ui.layout.Canvas());

    // embed HTML with default classes
    this._html = new qx.ui.embed.Html(`
        <button class="btn" style="width: 100%">${label}</button>
    `);

    // add child with layout properties
    this._add(this._html, { edge: 0 });

    // hook DOM click
    this._html.addListenerOnce("appear", () => {
      const btn = this._html.getContentElement().getDomElement().querySelector("button");
      btn.addEventListener("click", () => this.fireEvent("execute"));

      // Apply any pending variant/size/color changes (initialize previous values to avoid removing non-existent classes)
      const variant = this.getVariant();
      const size = this.getSize();
      const color = this.getColor();
      // Always apply variant (even if empty) to ensure base "btn" class is handled correctly
      this._previousVariant = null; // Reset to avoid removing non-existent class
      this._applyVariant(variant);
      if (size) {
        this._previousSize = null; // Reset to avoid removing non-existent class
        this._applySize(size);
      }
      if (color) {
        this._previousColor = null; // Reset to avoid removing non-existent class
        this._applyColor(color);
      }

      // Adjust the height of the qx.ui.embed.Html widget to match the button
      this._adjustHtmlHeight();
    });
  },

  members: {
    _previousVariant: null,
    _previousSize: null,
    _previousColor: null,

    _applyVariant(value) {
      const btn = this._getButtonElement();
      if (btn) {
        // Remove previous variant class if it exists
        if (this._previousVariant) {
          btn.classList.remove(`btn-${this._previousVariant}`);
          // Restore base "btn" class when removing variant
          btn.classList.add("btn");
        }
        // Add new variant class
        if (value) {
          // Remove base "btn" class when setting variant
          btn.classList.remove("btn");
          btn.classList.add(`btn-${value}`);
        } else {
          // If no variant, ensure base "btn" class is present
          if (!btn.classList.contains("btn")) {
            btn.classList.add("btn");
          }
        }
        this._previousVariant = value;
      }
    },

    _applySize(value) {
      const btn = this._getButtonElement();
      if (btn) {
        // Remove previous size class if it exists
        if (this._previousSize) {
          btn.classList.remove(`btn-${this._previousSize}`);
        }
        // Add new size class
        if (value) {
          btn.classList.add(`btn-${value}`);
        }
        this._previousSize = value;
      }
    },

    _applyColor(value) {
      const btn = this._getButtonElement();
      if (btn) {
        // Remove previous color class if it exists
        if (this._previousColor) {
          const prevClass = this._previousColor.startsWith("text-") 
            ? this._previousColor 
            : `text-${this._previousColor}`;
          btn.classList.remove(prevClass);
        }
        // Add new color class
        if (value) {
          // Ensure the class has "text-" prefix
          const colorClass = value.startsWith("text-") ? value : `text-${value}`;
          btn.classList.add(colorClass);
        }
        this._previousColor = value;
      }
    },

    _getButtonElement() {
      const domElement = this._html.getContentElement().getDomElement();
      return domElement ? domElement.querySelector("button") : null;
    },

    _adjustHtmlHeight() {
      const domElement = this._html.getContentElement().getDomElement();
      if (domElement) {
        const button = domElement.querySelector("button");
        if (button) {
          const buttonHeight = button.offsetHeight;
          this._html.setHeight(buttonHeight);
        }
      }
    }
  }
});
