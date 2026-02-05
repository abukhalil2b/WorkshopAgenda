const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 350,
    height: 600,
    frame: false,       // بدون إطار
    alwaysOnTop: true,  // دائماً في الأعلى
    transparent: true,  // خلفية شفافة
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // لتسهيل الكود للمبتدئين
    }
  })

  win.loadFile('index.html')
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, 'screen-saver');

  // استقبال أوامر الإغلاق والتصغير من الواجهة
  ipcMain.on('close-app', () => app.quit());
  ipcMain.on('minimize-app', () => win.minimize());
}

app.whenReady().then(createWindow)