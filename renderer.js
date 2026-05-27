window.currentVersion = 1;

// ── Toast helper ─────────────────────────────────────────────────────────────

function showToast(message, type = 'info', icon = null) {
  const bg = {
    success: 'linear-gradient(to right, #388e3c, #4caf50)',
    error:   'linear-gradient(to right, #c62828, #e53935)',
    warning: 'linear-gradient(to right, #e65100, #fb8c00)',
    info:    'linear-gradient(to right, #1565c0, #1976d2)',
  };

  const opts = {
    duration: 3500,
    gravity: 'bottom',
    position: 'right',
    stopOnFocus: true,
    style: { background: bg[type] || bg.info, borderRadius: '6px' },
  };

  if (icon) {
    // Use a DOM node so Font Awesome renders properly inside the toast.
    const node = document.createElement('div');
    node.style.cssText = 'display:flex;align-items:center;gap:0.5rem;';
    node.innerHTML = `<i class="${icon}" aria-hidden="true" style="font-size:1.1em;flex-shrink:0;"></i><span>${message}</span>`;
    opts.node = node;
  } else {
    opts.text = message;
  }

  Toastify(opts).showToast();
}

// ── Confirm modal (replaces window.confirm) ───────────────────────────────────

function showConfirm(message) {
  return new Promise((resolve) => {
    document.getElementById('confirm-message').textContent = message;
    const modal = document.getElementById('confirm-modal');
    modal.classList.add('active');

    function finish(result) {
      modal.classList.remove('active');
      resolve(result);
    }

    document.getElementById('confirm-yes').addEventListener('click', () => finish(true),  { once: true });
    document.getElementById('confirm-no').addEventListener('click',  () => finish(false), { once: true });
  });
}

// ── IMask instances ───────────────────────────────────────────────────────────

let activeMasks = [];

function applyMasks(selectedOption) {
  activeMasks.forEach((m) => m.destroy());
  activeMasks = [];

  if (selectedOption === 'Card') {
    activeMasks = [
      IMask(document.getElementById('cardnumber'), { mask: '0000 0000 0000 0000' }),
      IMask(document.getElementById('expirydate'), {
        mask: 'MM/YY',
        blocks: {
          MM: { mask: IMask.MaskedRange, from: 1,  to: 12, maxLength: 2 },
          YY: { mask: IMask.MaskedRange, from: 0,  to: 99, maxLength: 2 },
        },
      }),
      IMask(document.getElementById('cvv'), { mask: /^[0-9]{0,4}$/ }),
    ];
  } else if (selectedOption === 'Bank') {
    activeMasks = [
      IMask(document.getElementById('routing'), { mask: /^[0-9]{0,9}$/ }),
    ];
  }
}

// ── Filter ────────────────────────────────────────────────────────────────────

function applyCurrentFilter() {
  const activeBtn = document.querySelector('.filter-btn.active');
  const filter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
  document.querySelectorAll('#passwordList .password-item').forEach((item) => {
    const type = item.getAttribute('data-type');
    item.style.display = (filter === 'all' || type === filter) ? '' : 'none';
  });
}

// ── Password generation ───────────────────────────────────────────────────────

function generatePassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let pw = '';
  for (let i = 0; i < length; i++) pw += charset[Math.floor(Math.random() * charset.length)];
  return pw;
}

// ── Refresh all lists ─────────────────────────────────────────────────────────

const ENTRY_STORES = ['passwords', 'cards', 'bankAccounts', 'ids', 'notes'];

function refreshAllLists() {
  // Clear once here so individual display functions only append.
  document.getElementById('passwordList').innerHTML = '';
  displaySavedPasswords();
  displaySavedCards();
  displaySavedBankAccounts();
  displaySavedIDs();
  displaySavedNotes();
}

// ── Form type switching ───────────────────────────────────────────────────────

document.getElementById('passwordFormHeader').addEventListener('change', (e) => {
  const sel = e.target.value;

  if (sel === 'Password') {
    document.getElementById('formFields').innerHTML = `
      <label for="service">Service:</label>
      <input maxlength="30" type="text" id="service" required />
      <label for="email">Email:</label>
      <input maxlength="30" type="text" id="email" required />
      <label for="username">Username:</label>
      <input maxlength="30" type="text" id="username" required />
      <label for="password">Password:
        <button id="toggle-password" type="button" class="fas fa-eye field-action-btn"></button>
        <button id="generate-password" type="button" class="fas fa-key field-action-btn"></button>
      </label>
      <input maxlength="30" type="password" id="password" required />`;
    wirePasswordFieldButtons();

  } else if (sel === 'Card') {
    document.getElementById('formFields').innerHTML = `
      <label for="cardholder">Cardholder:</label>
      <input maxlength="30" type="text" id="cardholder" required />
      <label for="cardnumber">Card Number:</label>
      <input maxlength="19" type="text" id="cardnumber" placeholder="0000 0000 0000 0000" required />
      <label for="expirydate">Expiry Date:</label>
      <input type="text" id="expirydate" placeholder="MM/YY" required />
      <label for="cvv">CVV:</label>
      <input maxlength="4" type="password" id="cvv" required />`;

  } else if (sel === 'Bank') {
    document.getElementById('formFields').innerHTML = `
      <label for="bank">Bank / Financial Institution:</label>
      <input maxlength="30" type="text" id="bank" required />
      <label for="routing">Routing Number:</label>
      <input maxlength="9" type="text" id="routing" required />
      <label for="account">Account Number:</label>
      <input type="password" id="account" required />`;

  } else if (sel === 'ID') {
    document.getElementById('formFields').innerHTML = `
      <label for="idType">ID Type (Driver's License, Passport, etc.):</label>
      <input maxlength="30" type="text" id="idType" required />
      <label for="idNumber">ID Number:</label>
      <input maxlength="30" type="text" id="idNumber" required />`;

  } else if (sel === 'Note') {
    document.getElementById('formFields').innerHTML = `
      <label for="noteTitle">Title:</label>
      <input maxlength="30" type="text" id="noteTitle" required />
      <label for="noteContent">Content:</label>
      <textarea id="noteContent" rows="6" required></textarea>`;
  }

  applyMasks(sel);
});

// ── Wire eye / generate buttons (shared between initial load and form rebuild) ─

function wirePasswordFieldButtons() {
  const pwField  = document.getElementById('password');
  const toggleBtn = document.getElementById('toggle-password');
  const genBtn    = document.getElementById('generate-password');

  genBtn.addEventListener('click', () => { pwField.value = generatePassword(16); });

  toggleBtn.addEventListener('click', () => {
    if (pwField.type === 'password') {
      pwField.type = 'text';
      toggleBtn.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      pwField.type = 'password';
      toggleBtn.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
}

// Wire on initial page load (Password form is pre-rendered in HTML).
document.addEventListener('DOMContentLoaded', () => {
  wirePasswordFieldButtons();
  refreshAllLists();
});

// ── Form submit ───────────────────────────────────────────────────────────────

document.getElementById('passwordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formType = document.getElementById('passwordFormHeader').value;

  if (formType === 'Password') {
    const service  = document.getElementById('service').value.trim();
    const email    = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const rawPw    = document.getElementById('password').value.trim();

    if (!service || !email || !username || !rawPw) { showToast('Please fill in all fields.', 'warning'); return; }
    if (!/.+@.+/.test(email)) { showToast('Invalid email address.', 'warning'); return; }

    const password = await window.electronAPI.encrypt(rawPw);
    openDB((db) => {
      const tx = db.transaction('passwords', 'readwrite');
      tx.objectStore('passwords').put({ service, email, username, password });
      tx.oncomplete = () => { clearFormFields(); refreshAllLists(); showToast('Password saved!', 'success', 'fas fa-key'); };
      tx.onerror = (err) => { console.error(err); showToast('Failed to save entry.', 'error'); };
    });

  } else if (formType === 'Card') {
    const cardholder = document.getElementById('cardholder').value.trim();
    const cardnumber = document.getElementById('cardnumber').value.replace(/\s/g, '');
    const expirydate = document.getElementById('expirydate').value.trim();
    const rawCVV     = document.getElementById('cvv').value.trim();

    if (!cardholder || !cardnumber || !expirydate || !rawCVV) { showToast('Please fill in all fields.', 'warning'); return; }

    const cvv = await window.electronAPI.encrypt(rawCVV);
    openDB((db) => {
      const tx = db.transaction('cards', 'readwrite');
      tx.objectStore('cards').put({ cardholder, cardnumber, expirydate, cvv });
      tx.oncomplete = () => { clearFormFields(); refreshAllLists(); showToast('Card saved!', 'success', 'fas fa-credit-card'); };
      tx.onerror = (err) => { console.error(err); showToast('Failed to save entry.', 'error'); };
    });

  } else if (formType === 'Bank') {
    const bank    = document.getElementById('bank').value.trim();
    const routing = document.getElementById('routing').value.trim();
    const rawAcct = document.getElementById('account').value.trim();

    if (!bank || !routing || !rawAcct) { showToast('Please fill in all fields.', 'warning'); return; }

    const account = await window.electronAPI.encrypt(rawAcct);
    openDB((db) => {
      const tx = db.transaction('bankAccounts', 'readwrite');
      tx.objectStore('bankAccounts').put({ bank, routing, account });
      tx.oncomplete = () => { clearFormFields(); refreshAllLists(); showToast('Bank account saved!', 'success', 'fas fa-university'); };
      tx.onerror = (err) => { console.error(err); showToast('Failed to save entry.', 'error'); };
    });

  } else if (formType === 'ID') {
    const idType   = document.getElementById('idType').value.trim();
    const idNumber = document.getElementById('idNumber').value.trim();

    if (!idType || !idNumber) { showToast('Please fill in all fields.', 'warning'); return; }

    const encryptedIdNumber = await window.electronAPI.encrypt(idNumber);
    openDB((db) => {
      const tx = db.transaction('ids', 'readwrite');
      tx.objectStore('ids').put({ idType, encryptedIdNumber });
      tx.oncomplete = () => { clearFormFields(); refreshAllLists(); showToast('ID saved!', 'success', 'fas fa-id-card'); };
      tx.onerror = (err) => { console.error(err); showToast('Failed to save entry.', 'error'); };
    });

  } else if (formType === 'Note') {
    const noteTitle   = document.getElementById('noteTitle').value.trim();
    const rawContent  = document.getElementById('noteContent').value.trim();

    if (!noteTitle || !rawContent) { showToast('Please fill in all fields.', 'warning'); return; }

    const noteContent = await window.electronAPI.encrypt(rawContent);
    openDB((db) => {
      const tx = db.transaction('notes', 'readwrite');
      tx.objectStore('notes').put({ noteTitle, noteContent });
      tx.oncomplete = () => { clearFormFields(); refreshAllLists(); showToast('Note saved!', 'success', 'fas fa-sticky-note'); };
      tx.onerror = (err) => { console.error(err); showToast('Failed to save entry.', 'error'); };
    });
  }
});

// ── DB helper ─────────────────────────────────────────────────────────────────

function openDB(callback) {
  const req = indexedDB.open('PasswordManager', currentVersion);
  req.onsuccess = (e) => callback(e.target.result);
  req.onerror   = (err) => { console.error('DB error:', err); showToast('Database error.', 'error'); };
}

// ── Clear form fields ─────────────────────────────────────────────────────────

function clearFormFields() {
  const formType = document.getElementById('passwordFormHeader').value;
  const ids = {
    Password: ['service', 'email', 'username', 'password'],
    Card:     ['cardholder', 'cardnumber', 'expirydate', 'cvv'],
    Bank:     ['bank', 'routing', 'account'],
    ID:       ['idType', 'idNumber'],
    Note:     ['noteTitle', 'noteContent'],
  };
  (ids[formType] || []).forEach((id) => {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.disabled = false; }
  });
  // Re-sync IMask internal state after clearing values.
  activeMasks.forEach((m) => { try { m.updateValue(); } catch (_) {} });
  // Focus first field.
  const first = document.querySelector('#formFields input, #formFields textarea');
  if (first) first.focus();
}

// ── Display helpers ───────────────────────────────────────────────────────────

function visibilityDisplay() {
  return document.getElementById('toggle-visibility').checked ? 'block' : 'none';
}

function currentFilter() {
  return document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
}

function makeItem(type, html) {
  const div = document.createElement('div');
  div.classList.add('password-item');
  div.setAttribute('data-type', type);
  const f = currentFilter();
  if (f !== 'all' && f !== type) div.style.display = 'none';
  div.innerHTML = html;
  return div;
}

function deleteBtn(store, key) {
  return `<button class="delete-btn fa fa-trash-o" data-id="${key}" data-store="${store}"></button>`;
}

function copyBtn() {
  return `<button class="copy-btn fa fa-clipboard"></button>`;
}

// ── Display: Passwords ────────────────────────────────────────────────────────

async function displaySavedPasswords() {
  openDB(async (db) => {
    const tx    = db.transaction('passwords', 'readonly');
    const store = tx.objectStore('passwords');
    const allReq  = store.getAll();
    const keysReq = store.getAllKeys();

    allReq.onsuccess = async () => {
      const passwords = allReq.result;
      const keys = await new Promise((res) => { keysReq.onsuccess = () => res(keysReq.result); });
      const list = document.getElementById('passwordList');

      for (let i = 0; i < passwords.length; i++) {
        const { service, email, username, password } = passwords[i];
        const dec = await window.electronAPI.decrypt(password);
        const vd  = visibilityDisplay();
        list.appendChild(makeItem('passwords', `
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Username:</strong> ${username}</p>
          <p class="password-item-password" style="display:${vd};"><strong>Password:</strong> ${dec}</p>
          ${deleteBtn('passwords', keys[i])} ${copyBtn()}`));
      }
      attachListHandlers();
    };
  });
}

// ── Display: Cards ────────────────────────────────────────────────────────────

async function displaySavedCards() {
  openDB(async (db) => {
    const tx    = db.transaction('cards', 'readonly');
    const store = tx.objectStore('cards');
    const allReq  = store.getAll();
    const keysReq = store.getAllKeys();

    allReq.onsuccess = async () => {
      const cards = allReq.result;
      const keys = await new Promise((res) => { keysReq.onsuccess = () => res(keysReq.result); });
      const list = document.getElementById('passwordList');

      for (let i = 0; i < cards.length; i++) {
        const { cardholder, cardnumber, expirydate, cvv } = cards[i];
        const dec = await window.electronAPI.decrypt(cvv);
        const vd  = visibilityDisplay();
        const n   = cardnumber.replace(/\s/g, '');
        const fmt = `${n.slice(0,4)} ${n.slice(4,8)} ${n.slice(8,12)} ${n.slice(12,16)}`;
        list.appendChild(makeItem('cards', `
          <p><strong>Cardholder:</strong> ${cardholder}</p>
          <p><strong>Number:</strong> ${fmt}</p>
          <p><strong>Expires:</strong> ${expirydate}</p>
          <p class="password-item-password" style="display:${vd};"><strong>CVV:</strong> ${dec}</p>
          ${deleteBtn('cards', keys[i])} ${copyBtn()}`));
      }
      attachListHandlers();
    };
  });
}

// ── Display: Bank accounts ────────────────────────────────────────────────────

async function displaySavedBankAccounts() {
  openDB(async (db) => {
    const tx    = db.transaction('bankAccounts', 'readonly');
    const store = tx.objectStore('bankAccounts');
    const allReq  = store.getAll();
    const keysReq = store.getAllKeys();

    allReq.onsuccess = async () => {
      const accounts = allReq.result;
      const keys = await new Promise((res) => { keysReq.onsuccess = () => res(keysReq.result); });
      const list = document.getElementById('passwordList');

      for (let i = 0; i < accounts.length; i++) {
        const { bank, routing, account } = accounts[i];
        const dec = await window.electronAPI.decrypt(account);
        const vd  = visibilityDisplay();
        list.appendChild(makeItem('bank', `
          <p><strong>Bank:</strong> ${bank}</p>
          <p><strong>Routing:</strong> ${routing}</p>
          <p class="password-item-password" style="display:${vd};"><strong>Account:</strong> ${dec}</p>
          ${deleteBtn('bankAccounts', keys[i])} ${copyBtn()}`));
      }
      attachListHandlers();
    };
  });
}

// ── Display: IDs ──────────────────────────────────────────────────────────────

async function displaySavedIDs() {
  openDB(async (db) => {
    const tx    = db.transaction('ids', 'readonly');
    const store = tx.objectStore('ids');
    const allReq  = store.getAll();
    const keysReq = store.getAllKeys();

    allReq.onsuccess = async () => {
      const ids = allReq.result;
      const keys = await new Promise((res) => { keysReq.onsuccess = () => res(keysReq.result); });
      const list = document.getElementById('passwordList');

      for (let i = 0; i < ids.length; i++) {
        const { idType, encryptedIdNumber } = ids[i];
        const dec = await window.electronAPI.decrypt(encryptedIdNumber);
        const vd  = visibilityDisplay();
        list.appendChild(makeItem('ids', `
          <p><strong>ID Type:</strong> ${idType}</p>
          <p class="password-item-password" style="display:${vd};"><strong>ID Number:</strong> ${dec}</p>
          ${deleteBtn('ids', keys[i])} ${copyBtn()}`));
      }
      attachListHandlers();
    };
  });
}

// ── Display: Notes ────────────────────────────────────────────────────────────

async function displaySavedNotes() {
  openDB(async (db) => {
    const tx    = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    const allReq  = store.getAll();
    const keysReq = store.getAllKeys();

    allReq.onsuccess = async () => {
      const notes = allReq.result;
      const keys = await new Promise((res) => { keysReq.onsuccess = () => res(keysReq.result); });
      const list = document.getElementById('passwordList');

      for (let i = 0; i < notes.length; i++) {
        const { noteTitle, noteContent } = notes[i];
        const dec = await window.electronAPI.decrypt(noteContent);
        const vd  = visibilityDisplay();
        list.appendChild(makeItem('notes', `
          <p><strong>Title:</strong> ${noteTitle}</p>
          <p class="password-item-password" style="display:${vd};"><strong>Content:</strong> ${dec}</p>
          ${deleteBtn('notes', keys[i])} ${copyBtn()}`));
      }

      // Update entry count after the last display function completes.
      setTimeout(() => {
        const count = document.getElementById('passwordList').childElementCount;
        document.getElementById('num-entries').innerHTML = `<strong>Entry Count:</strong> ${count}`;
      }, 400);

      attachListHandlers();
    };
  });
}

// ── Attach delete / copy handlers ─────────────────────────────────────────────
// Called after each display function so newly appended items get handlers.
// Using onclick assignment prevents duplicate listeners from multiple calls.

function attachListHandlers() {
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.onclick = () => {
      const store = btn.getAttribute('data-store');
      const key   = parseInt(btn.getAttribute('data-id'), 10);
      removeEntry(store, key);
    };
  });

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.onclick = () => {
      const secretEl = btn.parentElement.querySelector('.password-item-password');
      if (!secretEl) return;
      // Strip "Label: " prefix before copying.
      const text = secretEl.innerText.replace(/^[^:]+:\s*/, '');
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard.', 'info');
        setTimeout(() => navigator.clipboard.writeText(' '), 30000);
      });
    };
  });
}

// ── Delete entry ──────────────────────────────────────────────────────────────

function removeEntry(storeName, key) {
  if (!ENTRY_STORES.includes(storeName) || Number.isNaN(key)) {
    console.error('Invalid delete request:', storeName, key);
    return;
  }
  openDB((db) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = () => refreshAllLists();
    tx.onerror = (err) => { console.error('Delete error:', err); showToast('Failed to delete entry.', 'error'); };
  });
}

// ── Dropdown click-outside ────────────────────────────────────────────────────

const settingsIcon = document.querySelector('.settings-icon');
const dropdown     = document.querySelector('.dropdown');

settingsIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) dropdown.classList.remove('active');
});

// ── Theme toggler ─────────────────────────────────────────────────────────────

document.getElementById('toggle-theme').addEventListener('click', () => {
  const link = document.getElementById('theme-link');
  link.setAttribute('href', link.getAttribute('href') === 'lightstyle.css' ? 'style.css' : 'lightstyle.css');
  document.body.classList.toggle('light-mode');
});

// ── Visibility toggler ────────────────────────────────────────────────────────

document.getElementById('toggle-visibility').addEventListener('click', function() {
  const display = this.checked ? 'block' : 'none';
  document.querySelectorAll('.password-item-password').forEach((p) => { p.style.display = display; });
});

// ── Filter buttons ────────────────────────────────────────────────────────────

document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    applyCurrentFilter();
  });
});

// ── Search ────────────────────────────────────────────────────────────────────

document.getElementById('search-bar').addEventListener('input', function() {
  const query = this.value.trim();
  if (query.length === 0) { refreshAllLists(); return; }

  searchPasswords(query).then((results) => {
    const list = document.getElementById('passwordList');
    list.innerHTML = '';
    const vd = visibilityDisplay();
    results.forEach((r) => {
      list.appendChild(makeItem('passwords', `
        <p><strong>Service:</strong> ${r.service}</p>
        <p><strong>Email:</strong> ${r.email}</p>
        <p><strong>Username:</strong> ${r.username}</p>
        <p class="password-item-password" style="display:${vd};"><strong>Password:</strong> ${r.password}</p>`));
    });
  }).catch((err) => {
    console.error(err);
    showToast('Search error.', 'error');
  });
});

function searchPasswords(searchTerm) {
  return new Promise((resolve, reject) => {
    openDB((db) => {
      const tx  = db.transaction('passwords', 'readonly');
      const req = tx.objectStore('passwords').getAll();
      req.onsuccess = async () => {
        const lower = searchTerm.toLowerCase();
        const matched = req.result.filter((e) =>
          e.service.toLowerCase().includes(lower) ||
          e.email.toLowerCase().includes(lower) ||
          e.username.toLowerCase().includes(lower)
        );
        for (const r of matched) r.password = await window.electronAPI.decrypt(r.password);
        resolve(matched);
      };
      req.onerror = () => reject(req.error);
    });
  });
}

// ── Self-destruct ─────────────────────────────────────────────────────────────

document.getElementById('self-destruct').addEventListener('click', async () => {
  dropdown.classList.remove('active');

  const confirmed = await showConfirm(
    'WARNING: This will permanently delete all saved entries. Your master password will be preserved. This cannot be undone.'
  );
  if (!confirmed) return;

  openDB((db) => {
    const tx = db.transaction(ENTRY_STORES, 'readwrite');
    ENTRY_STORES.forEach((s) => tx.objectStore(s).clear());
    tx.oncomplete = () => { showToast('All entries deleted.', 'success'); refreshAllLists(); };
    tx.onerror = (err) => { console.error(err); showToast('Failed to delete data.', 'error'); };
  });
});
