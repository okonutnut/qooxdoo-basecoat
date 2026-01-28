qx.Class.define("myTasks.components.export.ExportPdf", {
  extend: qx.ui.form.Button,

  construct(btnText) {
    this.base(arguments, this.tr(btnText || "PDF"));
    this.addListener("execute", this._onExport, this);
  },

  properties: {
    exportData: {
      nullable: true,
      check: "Array",
    },
  },

  members: {
    // Load JS dynamically
    _loadScript(url) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load script: " + url));
        document.head.appendChild(script);
      });
    },

    // Ensure pdfMake + Roboto fonts
    async _ensurePdfMake() {
      try {
        // Load pdfMake if not already loaded
        if (!window.pdfMake) {
          await this._loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/pdfmake.min.js",
          );
        }

        // Always load fonts - vfs_fonts.js sets up the virtual file system
        // Check if fonts are already available
        if (
          !window.pdfMake ||
          !window.pdfMake.vfs ||
          !window.pdfMake.fonts ||
          !window.pdfMake.fonts.Roboto
        ) {
          await this._loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/vfs_fonts.js",
          );
          // Wait for fonts to be registered
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        // Verify pdfMake is ready
        if (!window.pdfMake || typeof window.pdfMake.createPdf !== "function") {
          throw new Error("pdfMake failed to load properly");
        }
      } catch (e) {
        console.error("Error loading pdfMake:", e);
        throw e;
      }
    },

    _onExport() {
      this._ensurePdfMake()
        .then(() => {
          const data = this.getExportData();

          if (!Array.isArray(data) || data.length === 0) {
            console.warn("No data available to export");
            pdfMake
              .createPdf({ content: [{ text: "No data to display" }] })
              .open();
            return;
          }

          this._openPreview(data);
        })
        .catch((err) => {
          console.error("PDF preview failed:", err);
          alert(
            "Failed to generate PDF. Please check the browser console for details.",
          );
        });
    },

    _openPreview(data) {
      console.log("Building PDF for preview...");

      const headers = Object.keys(data[0]);
      const body = [];

      // Header row
      body.push(
        headers.map((h) => ({
          text: h,
          bold: true,
          fillColor: "#eeeeee",
        })),
      );

      // Data rows
      data.forEach((row, index) => {
        const rowData = headers.map((h) => ({
          text: row[h] !== undefined && row[h] !== null ? String(row[h]) : "",
        }));

        if (index % 2 === 0) {
          rowData.forEach((c) => (c.fillColor = "#f9f9f9"));
        }

        body.push(rowData);
      });

      const docDefinition = {
        content: [
          { text: "My Tasks", style: "header" },
          {
            table: {
              headerRows: 1,
              widths: headers.map(() => "*"),
              body,
            },
            layout: "lightHorizontalLines",
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
          },
        },
        defaultStyle: {
          fontSize: 12,
        },
      };

      console.log("Opening print preview...");
      const pdfDoc = pdfMake.createPdf(docDefinition);

      // Open PDF in new window for printing
      // Users can use browser's print dialog (Ctrl+P) from the PDF viewer
      pdfDoc.open();
    },
  },
});
