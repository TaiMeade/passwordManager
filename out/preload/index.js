"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  encrypt: (text) => ipcRenderer.invoke("encrypt", text),
  decrypt: (encryptedText) => ipcRenderer.invoke("decrypt", encryptedText),
  db: {
    checkMasterPassword: () => ipcRenderer.invoke("db:check-master-password"),
    setMasterPassword: (password) => ipcRenderer.invoke("db:set-master-password", password),
    verifyMasterPassword: (password) => ipcRenderer.invoke("db:verify-master-password", password),
    search: (term) => ipcRenderer.invoke("db:search", term),
    selfDestruct: () => ipcRenderer.invoke("db:self-destruct"),
    getEntryCount: () => ipcRenderer.invoke("db:get-entry-count")
  },
  passwords: {
    add: (data) => ipcRenderer.invoke("db:add-password", data),
    getAll: () => ipcRenderer.invoke("db:get-all-passwords"),
    delete: (id) => ipcRenderer.invoke("db:delete-password", id)
  },
  cards: {
    add: (data) => ipcRenderer.invoke("db:add-card", data),
    getAll: () => ipcRenderer.invoke("db:get-all-cards"),
    delete: (id) => ipcRenderer.invoke("db:delete-card", id)
  },
  bankAccounts: {
    add: (data) => ipcRenderer.invoke("db:add-bank-account", data),
    getAll: () => ipcRenderer.invoke("db:get-all-bank-accounts"),
    delete: (id) => ipcRenderer.invoke("db:delete-bank-account", id)
  },
  ids: {
    add: (data) => ipcRenderer.invoke("db:add-id", data),
    getAll: () => ipcRenderer.invoke("db:get-all-ids"),
    delete: (id) => ipcRenderer.invoke("db:delete-id", id)
  },
  notes: {
    add: (data) => ipcRenderer.invoke("db:add-note", data),
    getAll: () => ipcRenderer.invoke("db:get-all-notes"),
    delete: (id) => ipcRenderer.invoke("db:delete-note", id)
  }
});
