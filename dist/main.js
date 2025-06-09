"use strict";

const electron_1 = require("electron");
// Import backend server
require("../backend/server");
function createWindow() {
  const mainWindow = new electron_1.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL("http://localhost:5173");
}
electron_1.app.whenReady().then(() => {
  createWindow();
  electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron_1.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron_1.app.quit();
  }
});
