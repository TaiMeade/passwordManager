window.currentVersion = 14;

document.addEventListener('DOMContentLoaded', () => {
    displaySavedPasswords(); // Display saved passwords when the page loads
  });
  
  const passwordField = document.getElementById('password');
  const togglePassword = document.getElementById('toggle-password');

  document.getElementById('toggle-password').addEventListener('click', () => {
    if (passwordField.type === "password") {
      passwordField.type = "text";
      togglePassword.classList.remove("fa-eye");
      togglePassword.classList.add("fa-eye-slash");
    }
    else {
      passwordField.type = "password";
      togglePassword.classList.remove("fa-eye-slash");
      togglePassword.classList.add("fa-eye");
    }
  });

  document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

  
    // Get input values
    const service = document.getElementById('service').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = await window.electronAPI.encrypt(document.getElementById('password').value.trim());
  
    if (!service || !email || !username || !password) {
      alert('Please fill in all fields.');
      return;
    }
  
    const dbRequest = indexedDB.open('PasswordManager', currentVersion);
  
    
    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('passwords')) {
        db.createObjectStore('passwords', { autoIncrement: true, });
      }
    };
  
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('passwords', 'readwrite');
      const store = transaction.objectStore('passwords');
      store.put({ service, email, username, password });
  
      transaction.oncomplete = () => {
        // alert('Password saved successfully!');
  
        // Clear form fields
        clearFormFields();
  
        // Refresh the password list
        displaySavedPasswords();
      };
  
      transaction.onerror = (err) => {
        console.error('Error saving password:', err);
        alert('Failed to save password. Please try again.');
      };
    };
  
    dbRequest.onerror = (err) => {
      console.error('Database error:', err);
      alert('Failed to open the database. Please try again.');
    };
  });
  
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------- Clear Form Fields ------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  function clearFormFields() {
    // Clear and explicitly re-enable the input fields
    const serviceField = document.getElementById('service');
    const emailField = document.getElementById('email');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
  
    serviceField.value = '';
    emailField.value = '';
    usernameField.value = '';
    passwordField.value = '';

  
    serviceField.disabled = false;
    emailField.disabled = false;
    usernameField.disabled = false;
    passwordField.disabled = false;

    // Set serviceField (first input) as the active input...makes easier to input many passwords at once
    serviceField.focus();
  
    // Refocus on the first input for convenience
  }
  
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------- Display Saved Passwords ------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  async function displaySavedPasswords() {
    const dbRequest = indexedDB.open('PasswordManager', currentVersion);

    dbRequest.onsuccess = async (event) => {
        const db = event.target.result;
        const transaction = db.transaction('passwords', 'readonly');
        const store = transaction.objectStore('passwords');
        const getAllRequest = store.getAll();
        const keyListRequest = store.getAllKeys();

        getAllRequest.onsuccess = async () => {
            const passwords = getAllRequest.result;
            const keyList = await new Promise((resolve) => {
                keyListRequest.onsuccess = () => resolve(keyListRequest.result);
            });

            passwordList.innerHTML = ''; // Clear previous list

            for (let key = 0; key < passwords.length; key++) {
                const { service, email, username, password } = passwords[key];

                const decryptedPassword = await window.electronAPI.decrypt(password);

                const listItem = document.createElement('div');
                listItem.classList.add('password-item');
                if (document.getElementById('toggle-visibility').checked) {
                  listItem.innerHTML = `
                    <p><strong>Service:</strong> ${service}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Username:</strong> ${username}</p>
                    <p class="password-item-password" style="display:block;"><strong>Password:</strong> ${decryptedPassword}</p>
                    <button class="delete-btn fa fa-trash-o" data-id="${keyList[key]}" style="font-size:24px;color:red"></button>
                `;
                } else {
                  listItem.innerHTML = `
                    <p><strong>Service:</strong> ${service}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Username:</strong> ${username}</p>
                    <p class="password-item-password" style="display:none;"><strong>Password:</strong> ${decryptedPassword}</p>
                    <button class="delete-btn fa fa-trash-o" data-id="${keyList[key]}" style="font-size:24px;color:red"></button>
                `;
                }
                
                passwordList.appendChild(listItem);
            }

            // Attach delete button event listeners AFTER DOM is updated
            document.querySelectorAll('.delete-btn').forEach((button) => {
                button.addEventListener('click', (e) => {
                    const key = parseInt(e.target.getAttribute('data-id'), 10);
                    removePassword(key);
                });
            });
        };
    };
}
  
  // Dropdown menu script
  // Toggle Dropdown
  const settingsIcon = document.querySelector('.settings-icon');
  const dropdown = document.querySelector('.dropdown');

  settingsIcon.addEventListener('click', () => {
    dropdown.classList.toggle('active');
  });

  // Theme Toggler
  const toggleThemeBtn = document.getElementById('toggle-theme');
  const themeLink = document.getElementById('theme-link');

  // Functions to toggle light/dark mode
  toggleThemeBtn.addEventListener('click', () => {
    if (themeLink.getAttribute('href') === 'lightstyle.css') {
      themeLink.setAttribute('href', 'style.css');
      document.body.classList.add('light-mode'); // Add class for visual adjustments
      // console.log("light mode")
      return;
    }
    else {
      themeLink.setAttribute('href', 'lightstyle.css');
      document.body.classList.add('light-mode'); // Add class for visual adjustments
      // console.log("dark mode")
      return;
    }
  });

  // Password Visibility toggler
  const toggleVisibilityBtn = document.getElementById('toggle-visibility');
  
  toggleVisibilityBtn.addEventListener('click', () => {
    document.querySelectorAll('.password-item-password').forEach((paragraph) => {
      if (paragraph.style.display == "none") {
        paragraph.style = "display:block;";
      }
      else {
        paragraph.style = "display:none;";
      }
    })
  });

  // Function to remove a password (used with delete button on each entry)
  function removePassword(key) {
    const request = indexedDB.open('PasswordManager', currentVersion);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('passwords', 'readwrite');
      const store = transaction.objectStore('passwords');

      // console.log(typeof(key));
      // console.log(parseInt(key));
      const deleteRequest = store.delete(key);

      deleteRequest.onsuccess = () => {
        // alert('Password deleted successfully!');  causes error
        displaySavedPasswords();  // refresh list after deletion
      }

      deleteRequest.onerror = (err) => {
        console.error('Error deleting password:', err);
        alert('Failed to delete password. Please try again.')
      }
    }

    request.onerror = (err) => {
      console.error('Database error:', err)
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------- Search Database Method -------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// The outcome of this method is what I had originally envisioned...after consulting ChatGPT I used it's method to:
// First, retrieve all entries, then use Javascript to filter the data down to what meets the search criteria.
function searchDatabaseVersion2(searchTerm) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("PasswordManager", currentVersion);
    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["passwords"], "readonly");
        const store = transaction.objectStore("passwords");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = async function() {
          
            const results = getAllRequest.result.filter(entry =>
                entry.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.username.toLowerCase().includes(searchTerm.toLowerCase()) // ||
                // entry.password.toLowerCase().includes(searchTerm.toLowerCase()) // removed because this would cause some things to pop up when the substring being searched is present within the encrypted password
            );

            for (let result of results) {
              result.password = await window.electronAPI.decrypt(result.password);
            }

            resolve(results);
        };

        getAllRequest.onerror = function() {
            reject(getAllRequest.error);
        };
    };
  });
}

// Search function
// function searchDatabase(databaseName, storeName, searchKey, searchValue) {
//   return new Promise(async (resolve, reject) => {
//       // Open a connection to the database
//       const request = indexedDB.open(databaseName, currentVersion);

//       request.onerror = (event) => {
//           reject(`Failed to open the database: ${event.target.errorCode}`);
//       };

//       request.onsuccess = (event) => {
//           const db = event.target.result;
//           const transaction = db.transaction(storeName, "readonly");
//           const objectStore = transaction.objectStore(storeName);
//           const index = objectStore.index(searchKey);

//           const results = [];
//           const query = index.openCursor(IDBKeyRange.only(searchValue));

//           query.onerror = (event) => {
//               reject(`Error during search: ${event.target.errorCode}`);
//           };

//           query.onsuccess = (event) => {
//               const cursor = event.target.result;
//               if (cursor) {
//                   results.push(cursor.value); // Collect matching records
//                   cursor.continue();
//               } else {
//                   resolve(results); // Resolve promise with results when done
//               }
//           };
//       };

//       request.onupgradeneeded = () => {
//           reject("Database schema does not match expected.");
//       };
//   });
// }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------- Search Logic -----------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Searching logic
  const searchBar = document.getElementById('search-bar');
  const passwordListHeader = document.getElementById('passwordListHeader');
  const passwordList = document.getElementById('passwordList');
  const searchByWhat = document.getElementById('searchByWhat');

  searchBar.addEventListener('input', function(event) {
    const query = event.target.value;
    if (query.length > 0) {
      // searchDatabase('PasswordManager', 'passwords', searchByWhat.value, query).then(results => { no longer used thanks to ChatGPT recommendation of using javascript to filter
        searchDatabaseVersion2(query).then(results => {
          // Display results
          passwordListHeader.innerHTML = 'Search Results';
          if (document.getElementById('toggle-visibility').checked) {
            passwordList.innerHTML = results.map(result => 
              `<div class="password-item">
              <p><strong>Service:</strong> ${result.service}</p>
              <p><strong>Email:</strong> ${result.email}</p>
              <p><strong>Username:</strong> ${result.username}</p>
              <p class="password-item-password" style="display:block;"><strong>Password:</strong> ${result.password}</p>
              </div>`).join('')
          } else {
            passwordList.innerHTML = results.map(result => 
              `<div class="password-item">
              <p><strong>Service:</strong> ${result.service}</p>
              <p><strong>Email:</strong> ${result.email}</p>
              <p><strong>Username:</strong> ${result.username}</p>
              <p class="password-item-password" style="display:none;"><strong>Password:</strong> ${result.password}</p>
              </div>`).join('')
          }
        }).catch(error => {
        console.error(error);
        passwordListHeader.innerHTML = "Error during search";
        passwordList.innerHTML = error;
      })
    } else {
      passwordListHeader.innerHTML = "Saved Passwords";
      displaySavedPasswords();
    }
  });

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------- Self-Destruct Button ---------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // Self-Destruct button event listener (delete the database)
  const selfDestructButton = document.getElementById("self-destruct");

  selfDestructButton.addEventListener('click', () => {
    // Display a confirmation popup
    const confirmation = confirm(
      "WARNING: This action will permanently delete all your saved passwords. Are you sure you want to proceed? This cannot be undone."
    );

    // If the user confirms, proceed with deletion
    if (confirmation) {
      // Add your deletion logic here
      const dbRequest = indexedDB.open('PasswordManager', currentVersion);

      dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('passwords', 'readwrite');
        const store = transaction.objectStore('passwords');
        const clearRequest = store.clear();
        console.log("Database successfully deleted.");

        displaySavedPasswords();
    
        clearRequest.onerror = (err) => {
          console.error('Error deleting database:', err);
          console.log('Failed to delete database. Please try again.');
        };
      };
  
      dbRequest.onerror = (err) => {
      console.error('Database error:', err);
      console.log('Failed to open the database. Please try again.');
      };
      console.log("Self-destruct initiated: All data has been removed.");
    } else {
      // If the user cancels, do nothing
      console.log("Self-destruct canceled.");
    }
    
  });