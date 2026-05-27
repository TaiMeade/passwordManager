const { app, BrowserWindow, ipcMain, safeStorage, screen } = require("electron");
const path = require("path");

let mainWindow;
let loginWindow;

// Compute a window size that fits comfortably inside the user's primary
// display work area regardless of resolution. Caps at a reasonable upper
// bound so the window stays usable on 4K monitors, and floors at a minimum
// so the layout never collapses on small/low-DPI screens.
function getResponsiveWindowSize() {
  const { workAreaSize } = screen.getPrimaryDisplay();
  const targetWidth = Math.round(workAreaSize.width * 0.8);
  const targetHeight = Math.round(workAreaSize.height * 0.85);

  const width = Math.max(800, Math.min(targetWidth, 1600));
  const height = Math.max(600, Math.min(targetHeight, 1000));

  return { width, height };
}

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
  const { width, height } = getResponsiveWindowSize();

  loginWindow = new BrowserWindow({
    width,
    height,
    minWidth: 640,
    minHeight: 480,
    useContentSize: true,
    center: true,
    backgroundColor: "#1e1e1e",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  loginWindow.loadFile("checkPassword.html");

  loginWindow.on("closed", () => {
    loginWindow = null;
  });
}

function createMainWindow() {
  const { width, height } = getResponsiveWindowSize();

  mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: 720,
    minHeight: 540,
    useContentSize: true,
    center: true,
    backgroundColor: "#1e1e1e",
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
