// When enter is pressed while in input...submit the form AKA click the Save button
document.getElementById("masterPassword").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("saveMaster").click();
    }
})

document.getElementById("saveMaster").addEventListener("click", async () => {
    const password = document.getElementById("masterPassword").value;
    if (!password) {
        alert("Please enter a password.");
        return;
    }

    // Password must contain:
    //  9 or more characters
    //  One lower-case character
    //  One upper-case character
    //  One special character
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{9,}$/.test(password)) {
        alert("Password does not meet the minimum requirements: \n    Length must be longer than 8 characters.\n    Must contain at least 1 special character.\n    Must contain at least 1 lower-case letter.\n    Must contain at least 1 upper-case letter.");
        return
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
