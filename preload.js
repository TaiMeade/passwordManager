// preload.js 
const { contextBridge, ipcRenderer } = require('electron'); 
contextBridge.exposeInMainWorld('electronAPI', {
    savePassword: (data) => ipcRenderer.send('save-password', data),
    
    encrypt: (text) => ipcRenderer.invoke('encrypt', text),
    
    decrypt: (encryptedText) => ipcRenderer.invoke('decrypt', encryptedText)
});
