function showToast(message, type = 'info') {
  const bg = {
    success: 'linear-gradient(to right, #388e3c, #4caf50)',
    error:   'linear-gradient(to right, #c62828, #e53935)',
    warning: 'linear-gradient(to right, #e65100, #fb8c00)',
    info:    'linear-gradient(to right, #1565c0, #1976d2)',
  };
  Toastify({
    text: message,
    duration: 3500,
    gravity: 'bottom',
    position: 'right',
    stopOnFocus: true,
    style: { background: bg[type] || bg.info, borderRadius: '6px' },
  }).showToast();
}

document.getElementById('masterPasswordInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById('login').click();
  }
});

document.getElementById('login').addEventListener('click', async () => {
  const enteredPassword = document.getElementById('masterPasswordInput').value;
  if (!enteredPassword) {
    showToast('Please enter the master password.', 'warning');
    return;
  }

  const dbRequest = indexedDB.open('PasswordManager', window.currentVersion);

  dbRequest.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction('settings', 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get('masterPassword');

    request.onsuccess = async () => {
      if (!request.result) {
        showToast('Master password not set. Redirecting to setup…', 'warning');
        setTimeout(() => { window.location.href = 'setup.html'; }, 1500);
        return;
      }

      const decryptedPassword = await window.electronAPI.decrypt(request.result.value);

      if (decryptedPassword === enteredPassword) {
        window.location.href = 'welcome.html';
      } else {
        showToast('Incorrect password. Please try again.', 'error');
      }
    };

    request.onerror = (err) => {
      console.error('Error getting request:', err);
      showToast('Could not read master password. Please restart the app.', 'error');
    };
  };

  dbRequest.onerror = (err) => {
    console.error('Error retrieving database:', err);
    showToast('Database error.', 'error');
  };
});
