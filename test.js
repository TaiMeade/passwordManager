const { safeStorage } = require("electron");

function isEncryptionAvailable() {
    safeStorage.isEncryptionAvailable();
}

function encryptString(plaintext) {
    safeStorage.encryptString(plaintext);
}

export { isEncryptionAvailable, encryptString, };