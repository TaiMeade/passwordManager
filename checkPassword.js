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
