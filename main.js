const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 650,
    minWidth: 350, // يمنع تصغير العرض لدرجة تفسد الواجهة
    minHeight: 450, // يمنع تصغير الطول لدرجة تخفي الأزرار
    resizable: true, // تفعيل إمكانية تغيير الحجم
    frame: false, // لجعل النافذة عصرية بدون شريط ويندوز التقليدي
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver");

  // استقبال أوامر الإغلاق والتصغير من الواجهة
  ipcMain.on("close-app", () => app.quit());
  ipcMain.on("minimize-app", () => win.minimize());
}

app.whenReady().then(createWindow);
