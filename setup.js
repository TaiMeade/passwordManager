function showToast(message, type = 'info') {
  const bg = {
    success: 'linear-gradient(to right, #388e3c, #4caf50)',
    error:   'linear-gradient(to right, #c62828, #e53935)',
    warning: 'linear-gradient(to right, #e65100, #fb8c00)',
    info:    'linear-gradient(to right, #1565c0, #1976d2)',
  };
  Toastify({
    text: message,
    duration: 4000,
    gravity: 'bottom',
    position: 'right',
    stopOnFocus: true,
    style: { background: bg[type] || bg.info, borderRadius: '6px' },
  }).showToast();
}

document.getElementById('masterPassword').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById('saveMaster').click();
  }
});

document.getElementById('saveMaster').addEventListener('click', async () => {
  const password = document.getElementById('masterPassword').value;

  if (!password) {
    showToast('Please enter a password.', 'warning');
    return;
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{9,}$/.test(password)) {
    showToast('Password must be 9+ characters and include uppercase, lowercase, and a special character.', 'warning');
    return;
  }

  const encryptedPassword = await window.electronAPI.encrypt(password);

  const dbRequest = indexedDB.open('PasswordManager', window.currentVersion);

  dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    const stores = ['settings', 'passwords', 'cards', 'bankAccounts', 'ids', 'notes'];
    stores.forEach((name) => {
      if (!db.objectStoreNames.contains(name)) {
        db.createObjectStore(name, name === 'settings' ? { keyPath: 'id' } : { autoIncrement: true });
      }
    });
  };

  dbRequest.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction('settings', 'readwrite');
    const store = transaction.objectStore('settings');
    store.put({ id: 'masterPassword', value: encryptedPassword });
    transaction.oncomplete = () => {
      showToast('Master password saved! Redirecting…', 'success');
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    };
    transaction.onerror = (err) => {
      console.error(err);
      showToast('Failed to save master password.', 'error');
    };
  };

  dbRequest.onerror = (err) => {
    console.error(err);
    showToast('Database error.', 'error');
  };
});
