// TypeScript definitions for qooxdoo Framework
// This file provides type information for Language Server Protocol (LSP) support
// Generated and maintained for qooxdoo-basecoat project

declare namespace qx {
  /**
   * Core class system for defining qooxdoo classes
   */
  export namespace Class {
    interface ClassDefinition {
      type?: "abstract" | "static" | "singleton";
      base?: any;
      extend?: any;
      implement?: any | any[];
      include?: any | any[];
      construct?: Function;
      statics?: { [key: string]: any };
      properties?: { [key: string]: any };
      members?: { [key: string]: any };
      environment?: { [key: string]: any };
      events?: { [key: string]: string };
      defer?: Function;
      destruct?: Function;
      setLayout?: Function;
    }

    /**
     * Define a new class using the qooxdoo class system
     * @param name Name of the class (fully qualified, e.g., "myTasks.Application")
     * @param config Class definition structure
     * @returns The defined class constructor
     */
    function define(
      name: string | null,
      config: ClassDefinition,
    ): new (...args: any[]) => any;
  }

  /**
   * Core object system - base class for all qooxdoo objects
   */
  export namespace core {
    export class Object {
      constructor();

      // Object lifecycle
      dispose(): void;
      isDisposed(): boolean;

      // Method calling
      base(args: IArguments, ...varargs: any[]): any;
      self(args: IArguments): any;

      // Event system
      addListener(event: string, handler: Function, context?: any): void;
      removeListener(event: string, handler: Function, context?: any): void;
      addListenerOnce(event: string, handler: Function, context?: any): void;
      removeAllListeners(event?: string): void;
      fireEvent(event: string, data?: any): void;

      // Property system
      set(props: any): this;
      set(prop: string, value: any): this;
      get(prop: string): any;

      // Utility methods
      toString(): string;
      toHashCode(): string;
      toUuid(): string;
      clone(): Object;
    }

    export namespace Environment {
      function get(key: string): any;
      function select(key: string, map: { [key: string]: any }): any;
    }

    export namespace Init {
      function getApplication(): application.Standalone;
    }

    export namespace log {
      export namespace appender {
        export class Native {}
        export class Console {}
      }
    }
  }

  /**
   * Application classes
   */
  export namespace application {
    export class Standalone extends core.Object {
      constructor();
      main(): void;
      getRoot(): ui.core.Widget;
    }

    export class AbstractGui extends core.Object {
      getRoot(): ui.core.Widget;
    }
  }

  /**
   * UI Core classes
   */
  export namespace ui {
    export namespace core {
      export class Widget extends core.Object {
        constructor();

        // Visibility
        show(): void;
        hide(): void;
        toggle(): void;
        isVisible(): boolean;
        isSeeable(): boolean;

        // Layout
        setLayout(layout: any): void;
        getLayout(): any;
        _setLayout(layout: any): void; // Private method used in some contexts
        setLayoutProperties(props: any): void;
        getLayoutParent(): any;
        getBounds(): {
          left: number;
          top: number;
          width: number;
          height: number;
        };

        // Children management
        add(child: LayoutItem, options?: any): void;
        _add(child: LayoutItem, options?: any): void; // Private method used in some contexts
        remove(child: LayoutItem): void;
        removeAll(): void;
        getChildren(): LayoutItem[];
        hasChildren(): boolean;
        indexOf(child: LayoutItem): number;

        // Appearance
        setAppearance(appearance: string): void;
        getAppearance(): string;
        setBackgroundColor(color: string): this;
        setTextColor(color: string): this;
        setDecorator(decorator: string): void;
        setFont(font: bom.Font): void;

        // Dimensions
        setWidth(width: number | string): this;
        setHeight(height: number | string): this;
        setMinWidth(width: number | string): this;
        setMinHeight(height: number | string): this;
        setMaxWidth(width: number | string): this;
        setMaxHeight(height: number | string): this;
        getWidth(): number;
        getHeight(): number;

        // Position
        setLeft(left: number | string): this;
        setTop(top: number | string): this;
        setRight(right: number | string): this;
        setBottom(bottom: number | string): this;

        // Padding and margin
        setPadding(padding: number | string): this;
        setMargin(margin: number | string): this;

        // State
        setEnabled(enabled: boolean): void;
        isEnabled(): boolean;

        // Events
        addListener(event: string, handler: Function, context?: any): void;
        addListenerOnce(event: string, handler: Function, context?: any): void;
      }

      export class LayoutItem extends core.Object {
        getBounds(): {
          left: number;
          top: number;
          width: number;
          height: number;
        };
      }

      export class Spacer extends LayoutItem {
        constructor();
      }
    }

    /**
     * Container widgets
     */
    export namespace container {
      export class Composite extends core.Widget {
        constructor(layout?: any);
        setLayout(layout: any): void;
        add(child: core.LayoutItem, options?: any): void;
        remove(child: core.LayoutItem): void;
        removeAll(): void;
        getChildren(): core.LayoutItem[];
      }
    }

    /**
     * Layout managers
     */
    export namespace layout {
      export class Canvas extends core.Object {
        constructor();
      }

      export class VBox extends core.Object {
        constructor(spacing?: number, alignX?: string);
      }

      export class HBox extends core.Object {
        constructor(spacing?: number, alignY?: string);
      }

      export class Basic extends core.Object {
        constructor();
      }
    }

    /**
     * Form widgets
     */
    export namespace form {
      export class Button extends core.Widget {
        constructor(label?: string, icon?: string);
        setLabel(label: string): void;
        getLabel(): string;
        setIcon(icon: string): void;
        execute(): void;
        addListener(event: "execute", handler: Function, context?: any): void;
      }

      export class TextField extends core.Widget {
        constructor(value?: string);
        setValue(value: string): void;
        getValue(): string;
        setPlaceholder(placeholder: string): void;
        getPlaceholder(): string;
      }

      export class PasswordField extends TextField {
        constructor(value?: string);
      }

      export class DateField extends core.Widget {
        constructor();
        setValue(value: Date | null): void;
        getValue(): Date | null;
      }

      export class SelectBox extends core.Widget {
        constructor();
        setValue(value: any): void;
        getValue(): any;
        add(item: ListItem): void;
        remove(item: ListItem): void;
        getSelection(): ListItem[];
        setSelection(items: ListItem[]): void;
      }

      export class ListItem extends core.Widget {
        constructor(label: string);
        getLabel(): string;
        setLabel(label: string): void;
      }
    }

    /**
     * Basic widgets
     */
    export namespace basic {
      export class Label extends core.Widget {
        constructor(text?: string);
        setValue(text: string): void;
        getValue(): string;
        setFont(font: bom.Font): void;
      }

      export class Image extends core.Widget {
        constructor(source?: string);
        setSource(source: string): void;
        getSource(): string;
        setScale(scale: boolean): void;
        setAlignX(align: string): void;
        setAlignY(align: string): void;
      }
    }

    /**
     * Tab view
     */
    export namespace tabview {
      export class TabView extends container.Composite {
        constructor();
        add(page: Page): void;
        remove(page: Page): void;
      }

      export class Page extends container.Composite {
        constructor(label: string, icon?: string);
        setLabel(label: string): void;
        getLabel(): string;
      }
    }

    /**
     * Toolbar
     */
    export namespace toolbar {
      export class ToolBar extends container.Composite {
        constructor();
        add(item: core.Widget): void;
      }

      export class MenuButton extends form.Button {
        constructor(label?: string, icon?: string, menu?: menu.Menu);
        setMenu(menu: menu.Menu): void;
        getMenu(): menu.Menu;
      }
    }

    /**
     * Menu
     */
    export namespace menu {
      export class Menu extends container.Composite {
        constructor();
        add(item: core.Widget): void;
        remove(item: core.Widget): void;
        removeAll(): void;
      }

      export class Button extends form.Button {
        constructor(label?: string, icon?: string);
      }
    }

    /**
     * Table
     */
    export namespace table {
      export class Table extends core.Widget {
        constructor(tableModel?: table.model.Simple, custom?: any);
        getTableModel(): table.model.Simple;
        setTableModel(model: table.model.Simple): void;
        getTableColumnModel(): any;
        setSelectedRow(row: any): void;
        getSelectedRow(): any;
        addListener(
          event: "cellTap",
          handler: (e: ui.table.pane.CellEvent) => void,
          context?: any,
        ): void;
      }

      export namespace model {
        export class Simple extends core.Object {
          constructor();
          setData(data: any[][]): void;
          getData(): any[][];
          setColumns(columnNames: string[], columnIds: string[]): void;
          setColumnNames(names: string[]): void;
          getColumnNames(): string[];
          getRowData(rowIndex: number): any[];
          getRowDataAsMap(rowIndex: number): { [key: string]: any };
          getDataAsMapArray(): { [key: string]: any }[];
          getValue(columnIndex: number, rowIndex: number): any;
          setValue(columnIndex: number, rowIndex: number, value: any): void;
          setEditable(editable: boolean): void;
          setColumnEditable(columnIndex: number, editable: boolean): void;
          isColumnEditable(columnIndex: number): boolean;
          setColumnSortable(columnIndex: number, sortable: boolean): void;
          isColumnSortable(columnIndex: number): boolean;
          sortByColumn(columnIndex: number, ascending: boolean): void;
        }
      }
    }

    /**
     * Window
     */
    export namespace window {
      export class Window extends core.Widget {
        constructor(caption?: string, icon?: string);
        open(): void;
        close(): void;
        center(): void;
        openCentered(): void;
        setModal(modal: boolean): void;
        setShowClose(show: boolean): void;
        setShowMaximize(show: boolean): void;
        setShowMinimize(show: boolean): void;
        setResizable(resizable: boolean): void;
        setMovable(movable: boolean): void;
        getLayoutParent(): any;
      }
    }
  }

  /**
   * BOM (Browser Object Model) utilities
   */
  export namespace bom {
    export class Font extends core.Object {
      constructor();
      set(props: {
        size?: number;
        family?: string;
        bold?: boolean;
        italic?: boolean;
      }): this;
      setSize(size: number): this;
      setFamily(family: string): this;
      setBold(bold: boolean): this;
      setItalic(italic: boolean): this;
    }
  }

  /**
   * Event system
   */
  export namespace event {
    export namespace type {
      export class Event extends core.Object {
        getType(): string;
        getTarget(): any;
        getCurrentTarget(): any;
      }

      export class Data extends Event {
        getData(): any;
      }

      export class Mouse extends Data {
        getButton(): string;
        getViewportLeft(): number;
        getViewportTop(): number;
      }

      export class Pointer extends Mouse {
        getDocumentLeft(): number;
        getDocumentTop(): number;
      }
    }
  }

  /**
   * Table pane events
   */
  export namespace ui {
    export namespace table {
      export namespace pane {
        export class CellEvent extends event.type.Pointer {
          getRow(): number | null;
          getColumn(): number | null;
        }
      }
    }
  }
}

// Global qx object - this will be available at runtime
// Note: The actual qx object is provided by the qooxdoo framework at runtime

// Root widget type for applications
declare class Root {
  constructor();
  root: HTMLElement;
  add(element: any, options?: any): void;
  remove(element: any): void;
  removeAll(): void;
}

// Custom myTasks namespace
declare namespace myTasks {
  export class Application extends qx.application.Standalone {
    constructor();
    main(): void;
  }

  export namespace pages {
    export class LoginPage extends qx.ui.container.Composite {
      constructor();
      setLoggedIn(value: boolean): void;
      getLoggedIn(): boolean;
      addListener(
        event: "changeLoggedIn" | "switchToRegister",
        handler: Function,
        context?: any,
      ): void;
    }

    export class MainPage extends qx.ui.container.Composite {
      constructor();
      addListener(event: "logout", handler: Function, context?: any): void;
    }

    export class ToDoPage extends qx.ui.container.Composite {
      constructor();
    }

    export class InProgressPage extends qx.ui.container.Composite {
      constructor();
    }

    export class DonePage extends qx.ui.container.Composite {
      constructor();
    }

    export class RegisterPage extends qx.ui.container.Composite {
      constructor();
      addListener(
        event: "switchToLogin",
        handler: Function,
        context?: any,
      ): void;
    }
  }

  export namespace components {
    export class DataTable extends qx.ui.table.Table {
      constructor(tableModel?: qx.ui.table.model.Simple);
      getSelectedRow(): any;
      setSelectedRow(row: any): void;
      addListener(
        event: "cellTap" | "changeSelectedRow",
        handler: Function,
        context?: any,
      ): void;
    }

    export class Window extends qx.ui.window.Window {
      constructor(title?: string);
      openCentered(): void;
    }

    export namespace form {
      export class TaskForm extends qx.ui.container.Composite {
        constructor(taskObj?: any);
        setIsAdded(value: boolean): void;
        getIsAdded(): boolean;
        addListener(
          event: "changeIsAdded",
          handler: Function,
          context?: any,
        ): void;
      }
    }
  }

  export namespace globals {
    export class Tasks extends qx.core.Object {
      static getInstance(): Tasks;
      getValue(): any[][];
      setValue(value: any[][]): void;
      incrementStatus(rowIndex: number): void;
    }
  }
}

// The qx namespace is available globally in qooxdoo applications
