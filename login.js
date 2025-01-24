document.getElementById("login").addEventListener("click", async () => {
    const enteredPassword = document.getElementById("masterPasswordInput").value;
    if (!enteredPassword) {
        alert("Please enter the master password.");
        return;
    }

    // Retrieve stored encrypted master password
    const dbRequest = indexedDB.open("PasswordManager", window.currentVersion);
    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("settings", "readonly");
        const store = transaction.objectStore("settings");
        const request = store.get("masterPassword");

        request.onsuccess = async () => {
            console.log(request.result.value);
            if (!request.result) {
                alert("Master password not set. Please restart the app.");
                return;
            }

            const storedEncryptedPassword = request.result.value;

            // Decrypt and compare
            const decryptedPassword = await window.electronAPI.decrypt(storedEncryptedPassword);

            if (decryptedPassword === enteredPassword) {
                window.location.href = "welcome.html";
                setTimeout(() => {
                    window.location.href = "index.html"; // Redirect to main app
                }, 5000)
            } else {
                alert("Incorrect password. Try again.");
            }
        };
        request.onerror = (err) => {
            console.error('Error getting request:', err);
        } 
    };
    dbRequest.onerror = (err) => {
        console.error('Error retrieving database:', err);
    }
});
