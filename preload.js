// preload.js 
const { contextBridge, ipcRenderer } = require('electron'); 
contextBridge.exposeInMainWorld('electronAPI', { savePassword: (data) => ipcRenderer.send('save-password', data) });
