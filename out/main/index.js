"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./database");
const { encrypt, decrypt } = require("./encryption");
let mainWindow;
app.whenReady().then(() => {
  db.init();
  createWindow();
  registerIpcHandlers();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
function registerIpcHandlers() {
  ipcMain.handle("encrypt", (_, text) => encrypt(text));
  ipcMain.handle("decrypt", (_, encryptedText) => decrypt(encryptedText));
  ipcMain.handle("db:check-master-password", () => {
    return db.getSetting("masterPassword") !== null;
  });
  ipcMain.handle("db:set-master-password", (_, password) => {
    const encrypted = encrypt(password);
    db.setSetting("masterPassword", encrypted);
    return true;
  });
  ipcMain.handle("db:verify-master-password", (_, entered) => {
    const stored = db.getSetting("masterPassword");
    if (!stored) return false;
    const decrypted = decrypt(stored);
    return decrypted === entered;
  });
  ipcMain.handle("db:add-password", (_, data) => {
    data.password = encrypt(data.password);
    db.addPassword(data);
    return true;
  });
  ipcMain.handle("db:get-all-passwords", () => {
    const rows = db.getAllPasswords();
    return rows.map((row) => ({ ...row, password: decrypt(row.password) }));
  });
  ipcMain.handle("db:delete-password", (_, id) => {
    db.deletePassword(id);
    return true;
  });
  ipcMain.handle("db:add-card", (_, data) => {
    data.cvv = encrypt(data.cvv);
    db.addCard(data);
    return true;
  });
  ipcMain.handle("db:get-all-cards", () => {
    const rows = db.getAllCards();
    return rows.map((row) => ({ ...row, cvv: decrypt(row.cvv) }));
  });
  ipcMain.handle("db:delete-card", (_, id) => {
    db.deleteCard(id);
    return true;
  });
  ipcMain.handle("db:add-bank-account", (_, data) => {
    data.account = encrypt(data.account);
    db.addBankAccount(data);
    return true;
  });
  ipcMain.handle("db:get-all-bank-accounts", () => {
    const rows = db.getAllBankAccounts();
    return rows.map((row) => ({ ...row, account: decrypt(row.account) }));
  });
  ipcMain.handle("db:delete-bank-account", (_, id) => {
    db.deleteBankAccount(id);
    return true;
  });
  ipcMain.handle("db:add-id", (_, data) => {
    data.id_number = encrypt(data.id_number);
    db.addId(data);
    return true;
  });
  ipcMain.handle("db:get-all-ids", () => {
    const rows = db.getAllIds();
    return rows.map((row) => ({ ...row, id_number: decrypt(row.id_number) }));
  });
  ipcMain.handle("db:delete-id", (_, id) => {
    db.deleteId(id);
    return true;
  });
  ipcMain.handle("db:add-note", (_, data) => {
    data.content = encrypt(data.content);
    db.addNote(data);
    return true;
  });
  ipcMain.handle("db:get-all-notes", () => {
    const rows = db.getAllNotes();
    return rows.map((row) => ({ ...row, content: decrypt(row.content) }));
  });
  ipcMain.handle("db:delete-note", (_, id) => {
    db.deleteNote(id);
    return true;
  });
  ipcMain.handle("db:search", (_, term) => {
    const results = db.search(term);
    return results.map((row) => {
      const decrypted = { ...row };
      switch (row.entry_type) {
        case "password":
          decrypted.password = decrypt(row.password);
          break;
        case "card":
          decrypted.cvv = decrypt(row.cvv);
          break;
        case "bank":
          decrypted.account = decrypt(row.account);
          break;
        case "id":
          decrypted.id_number = decrypt(row.id_number);
          break;
        case "note":
          decrypted.content = decrypt(row.content);
          break;
      }
      return decrypted;
    });
  });
  ipcMain.handle("db:self-destruct", () => {
    db.selfDestruct();
    return true;
  });
  ipcMain.handle("db:get-entry-count", () => {
    return db.getEntryCount();
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
