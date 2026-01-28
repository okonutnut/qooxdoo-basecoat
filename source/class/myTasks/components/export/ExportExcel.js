qx.Class.define("myTasks.components.export.ExportExcel", {
  extend: qx.ui.form.Button,

  construct(btnText) {
    this.base(arguments, this.tr(btnText || "Excel"));
    this.addListener("execute", this._onExport, this);
  },

  properties: {
    exportData: {
      nullable: true,
      check: "Array",
    },
    fileName: {
      init: "tasks.xlsx",
      check: "String",
    },
  },

  members: {
    // Utility to dynamically load a JS script
    _loadScript(url) {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${url}"]`);
        if (existing) {
          console.log(`Script already loaded: ${url}`);
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = url;
        script.onload = () => {
          console.log(`Loaded script: ${url}`);
          resolve();
        };
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
      });
    },

    async _ensureExcelJS() {
      if (!window.ExcelJS) {
        console.log("Loading ExcelJS...");
        await this._loadScript("resource/myTasks/lib/exceljs.min.js");
      }

      if (!window.ExcelJS) throw new Error("ExcelJS failed to load!");
      console.log("ExcelJS is ready.");
    },

    async _onExport() {
      try {
        await this._ensureExcelJS();

        const data = this.getExportData();

        if (!Array.isArray(data) || data.length === 0) {
          qx.log.Logger.warn("No data provided for Excel export");
          return;
        }

        this._createExcel(data);
      } catch (err) {
        console.error("Error exporting Excel:", err);
      }
    },

    _createExcel(data) {
      console.log("Creating Excel workbook...");

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Tasks");

      const keys = Object.keys(data[0]);
      sheet.columns = keys.map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key,
        width: 20,
      }));

      data.forEach((row) => sheet.addRow(row));
      sheet.getRow(1).font = { bold: true };

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        this._downloadBlob(blob, this.getFileName());
      });

      console.log("Excel workbook created and download started.");
    },

    _downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`File download triggered: ${filename}`);
    },
  },
});
