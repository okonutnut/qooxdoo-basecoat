qx.Class.define("myTasks.basecoat.Input", {
  extend: qx.ui.core.Widget,

  events: {
    "change": "qx.event.type.Data",
    "input": "qx.event.type.Data"
  },

  properties: {
    /**
     * Input type. Valid values: "text" (default), "email", "password", "number", "tel", "url", "search", etc.
     * @see https://basecoatui.com/components/input/
     */
    type: {
      check: "String",
      init: "text",
      apply: "_applyType"
    },
    /**
     * Placeholder text for the input field
     * @see https://basecoatui.com/components/input/
     */
    placeholder: {
      check: "String",
      init: "",
      apply: "_applyPlaceholder"
    },
    /**
     * Input value
     */
    value: {
      check: "String",
      init: "",
      apply: "_applyValue"
    },
    /**
     * Whether the input is disabled
     * @see https://basecoatui.com/components/input/
     */
    disabled: {
      check: "Boolean",
      init: false,
      apply: "_applyDisabled"
    },
    /**
     * Whether the input is invalid (sets aria-invalid="true")
     * @see https://basecoatui.com/components/input/
     */
    invalid: {
      check: "Boolean",
      init: false,
      apply: "_applyInvalid"
    }
  },

  construct(placeholder = "", type = "text") {
    super();

    // set a layout so children get measured and laid out
    this._setLayout(new qx.ui.layout.Canvas());

    // embed HTML with default classes
    this._html = new qx.ui.embed.Html(`
        <input class="input" type="${type}" placeholder="${placeholder}" style="width: 100%">
    `);

    // add child with layout properties
    this._add(this._html, { edge: 0 });

    // hook DOM events
    this._html.addListenerOnce("appear", () => {
      const input = this._getInputElement();
      
      // Apply any pending property changes
      const type = this.getType();
      const placeholder = this.getPlaceholder();
      const value = this.getValue();
      const disabled = this.getDisabled();
      const invalid = this.getInvalid();
      
      // Apply type (if different from constructor)
      if (type !== "text") {
        this._applyType(type);
      }
      
      // Apply placeholder (if different from constructor)
      if (placeholder) {
        this._applyPlaceholder(placeholder);
      }
      
      // Apply value
      if (value) {
        this._applyValue(value);
      }
      
      // Apply disabled state
      if (disabled) {
        this._applyDisabled(disabled);
      }
      
      // Apply invalid state
      if (invalid) {
        this._applyInvalid(invalid);
      }

      // Add event listeners
      input.addEventListener("change", (e) => {
        this.setValue(e.target.value);
        this.fireDataEvent("change", e.target.value);
      });

      input.addEventListener("input", (e) => {
        this.setValue(e.target.value);
        this.fireDataEvent("input", e.target.value);
      });

      // Adjust the height of the qx.ui.embed.Html widget to match the input
      this._adjustHtmlHeight();
    });
  },

  members: {
    _applyType(value) {
      const input = this._getInputElement();
      if (input) {
        input.type = value || "text";
      }
    },

    _applyPlaceholder(value) {
      const input = this._getInputElement();
      if (input) {
        input.placeholder = value || "";
      }
    },

    _applyValue(value) {
      const input = this._getInputElement();
      if (input) {
        // Only update if value actually changed to avoid cursor position issues
        if (input.value !== value) {
          input.value = value || "";
        }
      }
    },

    _applyDisabled(value) {
      const input = this._getInputElement();
      if (input) {
        if (value) {
          input.setAttribute("disabled", "disabled");
        } else {
          input.removeAttribute("disabled");
        }
      }
    },

    _applyInvalid(value) {
      const input = this._getInputElement();
      if (input) {
        if (value) {
          input.setAttribute("aria-invalid", "true");
        } else {
          input.removeAttribute("aria-invalid");
        }
      }
    },

    _getInputElement() {
      const domElement = this._html.getContentElement().getDomElement();
      return domElement ? domElement.querySelector("input") : null;
    },

    _adjustHtmlHeight() {
      const domElement = this._html.getContentElement().getDomElement();
      if (domElement) {
        const input = domElement.querySelector("input");
        if (input) {
          const inputHeight = input.offsetHeight;
          this._html.setHeight(inputHeight);
        }
      }
    },

    /**
     * Get the current value of the input field
     * @return {String} The current value
     */
    getValue() {
      const input = this._getInputElement();
      return input ? input.value : this.getProperty("value");
    }
  }
});

