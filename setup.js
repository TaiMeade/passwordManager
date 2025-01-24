document.getElementById("saveMaster").addEventListener("click", async () => {
    const password = document.getElementById("masterPassword").value;
    if (!password) {
        alert("Please enter a password.");
        return;
    }

    // Encrypt password before storing
    const encryptedPassword = await window.electronAPI.encrypt(password);

    // Store in IndexedDB
    const dbRequest = indexedDB.open("PasswordManager", window.currentVersion);
    dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("settings")) {
            db.createObjectStore("settings", { keyPath: "id" });
        }
    };
    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("settings", "readwrite");
        const store = transaction.objectStore("settings");
        store.put({ id: "masterPassword", value: encryptedPassword });
        transaction.oncomplete = () => {
            alert("Master password set successfully!");
            window.location.href = "login.html"; // Redirect to login page
        };
    };
});
