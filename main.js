// const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
// const path = require('path');
// let mainWindow;

// app.whenReady().then(() => {
//   mainWindow = createMainWindow();

//   ipcMain.handle("encrypt", (_, text) => {
//     if (safeStorage.isEncryptionAvailable()) {
//       return safeStorage.encryptString(text).toString("base64");
//     }
//     return null; // Indicate encryption is not available
//   });

//   ipcMain.handle("decrypt", (_, encryptedText) => {
//     try {
//       const encryptedBuffer = Buffer.from(encryptedText, "base64");
//       return safeStorage.decryptString(encryptedBuffer);
//     } catch (error) {
//       console.error("Decryption error:", error);
//       return null; // Return null if decryption fails
//     }
//   });

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       mainWindow = createMainWindow();
//     }
//   });
// });

// function createMainWindow() {
//   const win = new BrowserWindow({
//     width: 1920,
//     height: 1080,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       contextIsolation: true,
//       nodeIntegration: false
//     }
//   });

//   win.loadFile('index.html');
//   return win;
// }

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

const { app, BrowserWindow, ipcMain, safeStorage } = require("electron");
const path = require("path");

let mainWindow;
let loginWindow;

app.whenReady().then(() => {
  createLoginWindow();

  ipcMain.handle("encrypt", (_, text) => {
    if (safeStorage.isEncryptionAvailable()) {
      return safeStorage.encryptString(text).toString("base64");
    }
    return null; // Indicate encryption is not available
  });

  ipcMain.handle("decrypt", (_, encryptedText) => {
    try {
      const encryptedBuffer = Buffer.from(encryptedText, "base64");
      return safeStorage.decryptString(encryptedBuffer);
    } catch (error) {
      console.error("Decryption error:", error);
      return null; // Return null if decryption fails
    }
  });
});

function createLoginWindow() {
  var fileToLoad = "checkPassword.html";
  loginWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  loginWindow.loadFile(fileToLoad);

  loginWindow.on("closed", () => {
    loginWindow = null;
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.on("authenticate", (event, isValid) => {
  if (isValid) {
    loginWindow.close();
    createMainWindow();
  } else {
    event.reply("auth-failed", "Incorrect password!");
  }
});
