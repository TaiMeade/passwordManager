const dbRequest = indexedDB.open("PasswordManager", window.currentVersion);

dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("passwords")) {
        db.createObjectStore("passwords", { autoIncrement: true, });
    }
};

dbRequest.onsuccess = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains("settings")) {
        const version = db.version + 1;
        window.version = version;
        db.close();
        const upgradeRequest = indexedDB.open("PasswordManager", version);

        upgradeRequest.onupgradeneeded = (event) => {
            event.target.result.createObjectStore("settings", { keyPath: "id" });
            checkMasterPasswordExistence();
        };
    }
    else {
        checkMasterPasswordExistence();
    }
};

function checkMasterPasswordExistence() {
    const dbRequest = indexedDB.open("PasswordManager", window.currentVersion);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const tx = db.transaction("settings", "readonly");
        const store = tx.objectStore("settings");
        const request = store.get("masterPassword");

        request.onsuccess = () => {
            if (request.result) {
                window.location.href = "login.html"; // Master password exists → go to login
            } else {
                window.location.href = "setup.html"; // No master password → setup
            }
        };
    };
}