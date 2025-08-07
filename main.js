const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const QRCode = require('qrcode');
const fs = require('fs');

ipcMain.handle('generate-qr', async (event, wifiString) => {
  try {
    return await QRCode.toDataURL(wifiString);
  } catch (err) {
    console.error(err);
    return null;
  }
});

ipcMain.handle('save-dialog', async (event, dataURL) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: 'wifi-qr-code.png',
    filters: [{ name: 'PNG Images', extensions: ['png'] }]
  });

  if (filePath) {
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
});

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
