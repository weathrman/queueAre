
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveDialog: (data) => ipcRenderer.invoke('save-dialog', data),
  generateQR: (data) => ipcRenderer.invoke('generate-qr', data)
});
