window.currentVersion = 1;

// Generate a random password of a provided length
function generatePassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
  }
  return password;
}

// dynamically change the form fields based on the selected option in the dropdown
document.getElementById('passwordFormHeader').addEventListener('change', (e) => {
  const selectedOption = e.target.value;

  // handle changing the form fields based on the selected option
  if (selectedOption === "Password") {
    document.getElementById('formFields').innerHTML = `<label for="service">Service:</label>
                                                       <input maxlength="30" type="text" id="service" required />
                                                       <label for="email">Email:</label>
                                                       <input maxlength="30" type="text" id="email" required />
                                                       <label for="username">Username:</label>
                                                       <input maxlength="30" type="text" id="username" required />
                                                       <label for="password">Password:
                                                       <button id="toggle-password" type="button" class="fas fa-eye" style="width:10%;height:10%; background-color: rgba(0, 0, 0, 0); float:right; padding-top: 5px;"></button>
                                                       <button id="generate-password" type="button" class="fas fa-key" style="width:10%;height:10%; background-color: rgba(0, 0, 0, 0); float:right; padding-top: 5px;"></button>
                                                       </label>  
                                                       <input maxlength="30" type="password" id="password" required />`;

    document.getElementById('generate-password').addEventListener('click', () => {
      passwordField.value = generatePassword(16); // Generate a 16-character password
    });
  } else if (selectedOption === "Card") {
    document.getElementById('formFields').innerHTML = `<label for="cardholder">Cardholder:</label>
                                                       <input maxlength="30" type="text" id="cardholder" required />
                                                       <label for="cardnumber">Card Number:</label>
                                                       <input maxlength="19" type="text" id="cardnumber" required />
                                                       <label for="expirydate">Expiry Date:</label>
                                                       <input maxlength="5" type="text" id="expirydate" placeholder="MM/YY" required />
                                                       <label for="cvv">CVV:</label>
                                                       <input maxlength="4" type="password" id="cvv" required />`
  } else if (selectedOption === "Bank") {
    document.getElementById('formFields').innerHTML = `<label for="bank">Bank/Financial Institution:</label>
                                                       <input maxlength="30" type="text" id="bank" required />
                                                       <label for="routing">Routing Number:</label>
                                                       <input type="text" id="routing" required></input>
                                                       <label for="account">Account Number:</label>
                                                       <input type="password" id="account" required></input>`;
  } else if (selectedOption === "ID") {
    document.getElementById('formFields').innerHTML = `<label for="idType">ID Type (Driver's License, Passport, etc.):</label>
                                                       <input maxlength="30" type="text" id="idType" required />
                                                       <label for="idNumber">ID Number:</label>
                                                       <input maxlength="30" type="text" id="idNumber" required />`;
  } else if (selectedOption === "Note") {
    document.getElementById('formFields').innerHTML = `<label for="noteTitle">Title:</label>
                                                       <input maxlength="30" type="text" id="noteTitle" required />
                                                       <label for="noteContent">Content:</label>
                                                       <textarea id="noteContent" rows="10" cols="50" required></textarea>`;
  }
});

document.addEventListener('DOMContentLoaded', () => {
    displaySavedPasswords(); // Display saved passwords when the page loads
  });
  
  const passwordField = document.getElementById('password');
  const togglePassword = document.getElementById('toggle-password');

  document.getElementById('generate-password').addEventListener('click', () => {
    passwordField.value = generatePassword(16); // Generate a 16-character password
  });

  togglePassword.addEventListener('click', () => {
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

    // handle saving the password entry to IndexedDB
    if (document.getElementById('passwordFormHeader').value === "Password") {
      const service = document.getElementById('service').value.trim();
      const email = document.getElementById('email').value.trim();
      const username = document.getElementById('username').value.trim();
      const password = await window.electronAPI.encrypt(document.getElementById('password').value.trim());

      if (!service || !email || !username || !password) {
        alert('Please fill in all fields.');
        return;
      }

      if (!/.+@.+/.test(email)) {
        alert("Invalid Email.")
        return
      }
  
      const dbRequest = indexedDB.open('PasswordManager', currentVersion);
    
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
    }
    
    // handle saving the card entry to IndexedDB
    else if (document.getElementById('passwordFormHeader').value === "Card") {
      const cardholder = document.getElementById('cardholder').value.trim();
      const cardnumber = document.getElementById('cardnumber').value.trim(); // repurposed field
      const expirydate = document.getElementById('expirydate').value.trim(); // repurposed field
      const cvv = await window.electronAPI.encrypt(document.getElementById('cvv').value.trim()); // repurposed field

      if (!cardholder || !cardnumber || !expirydate || !cvv) {
        alert('Please fill in all fields.');
        return;
      }
  
      const dbRequest = indexedDB.open('PasswordManager', currentVersion);
    
      dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('cards', 'readwrite');
        const store = transaction.objectStore('cards');
        store.put({ cardholder, cardnumber, expirydate, cvv });

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
    } 
    
    // handle saving the bank entry to IndexedDB
    else if (document.getElementById('passwordFormHeader').value === "Bank") {
      const bank = document.getElementById('bank').value.trim();
      const routing = document.getElementById('routing').value.trim(); 
      const account = await window.electronAPI.encrypt(document.getElementById('account').value.trim());

      if (!bank || !routing || !account) {
        alert('Please fill in all fields.');
        return;
      }
  
      const dbRequest = indexedDB.open('PasswordManager', currentVersion);
    
      dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('banks', 'readwrite');
        const store = transaction.objectStore('banks');
        store.put({ bank, routing, account });

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
    }

    // handle saving the ID entry to IndexedDB
    else if (document.getElementById('passwordFormHeader').value === "ID") {
      const idType = document.getElementById('idType').value.trim();
      const idNumber = document.getElementById('idNumber').value.trim();
      const encryptedIdNumber = await window.electronAPI.encrypt(idNumber);

      if (!idType || !idNumber) {
        alert('Please fill in all fields.');
        return;
      }
  
      const dbRequest = indexedDB.open('PasswordManager', currentVersion);
    
      dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('ids', 'readwrite');
        const store = transaction.objectStore('ids');
        store.put({ idType, encryptedIdNumber });

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
    } 
    
    // handle saving the note entry to IndexedDB
    else if (document.getElementById('passwordFormHeader').value === "Note") {
      const noteTitle = document.getElementById('noteTitle').value.trim();
      const noteContent = document.getElementById('noteContent').value.trim();

      if (!noteTitle || !noteContent) {
        alert('Please fill in all fields.');
        return;
      }
  
      const dbRequest = indexedDB.open('PasswordManager', currentVersion);
    
      dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');
        store.put({ noteTitle, noteContent });

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
    }
  });
  
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------- Clear Form Fields ------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  function clearFormFields() {
    // Clear and explicitly re-enable the input fields
    if (document.getElementById('passwordFormHeader').value === "Password") {
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
    } else if (document.getElementById('passwordFormHeader').value === "Card") {
      const cardholderField = document.getElementById('cardholder');
      const cardnumberField = document.getElementById('cardnumber');
      const expirydateField = document.getElementById('expirydate');
      const cvvField = document.getElementById('cvv');
    
      cardholderField.value = '';
      cardnumberField.value = '';
      expirydateField.value = '';
      cvvField.value = '';

    
      cardholderField.disabled = false;
      cardnumberField.disabled = false;
      expirydateField.disabled = false;
      cvvField.disabled = false;

      // Set cardholderField (first input) as the active input...makes easier to input many cards at once
      cardholderField.focus();
    } else if (document.getElementById('passwordFormHeader').value === "Bank") {
      const bankField = document.getElementById('bank');
      const routingField = document.getElementById('routing');
      const accountField = document.getElementById('account');
    
      bankField.value = '';
      routingField.value = '';
      accountField.value = '';

    
      bankField.disabled = false;
      routingField.disabled = false;
      accountField.disabled = false;

      // Set bankField (first input) as the active input...makes easier to input many banks at once
      bankField.focus();
    } else if (document.getElementById('passwordFormHeader').value === "ID") {  
      const idTypeField = document.getElementById('idType');
      const idNumberField = document.getElementById('idNumber');
    
      idTypeField.value = '';
      idNumberField.value = '';

    
      idTypeField.disabled = false;
      idNumberField.disabled = false;

      // Set idTypeField (first input) as the active input...makes easier to input many IDs at once
      idTypeField.focus();
    } else if (document.getElementById('passwordFormHeader').value === "Note") {  
      const noteTitleField = document.getElementById('noteTitle');
      const noteContentField = document.getElementById('noteContent');
    
      noteTitleField.value = '';
      noteContentField.value = '';

    
      noteTitleField.disabled = false;
      noteContentField.disabled = false;

      // Set noteTitleField (first input) as the active input...makes easier to input many notes at once
      noteTitleField.focus();
    }
  
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

            // Used to track the number of entries
            let numEntries = 0

            for (let key = 0; key < passwords.length; key++) {
                numEntries++;
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
                    <button class="copy-btn fa fa-clipboard" style="font-size:24px;color:grey"></button>
                `;
                } else {
                  listItem.innerHTML = `
                    <p><strong>Service:</strong> ${service}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Username:</strong> ${username}</p>
                    <p class="password-item-password" style="display:none;"><strong>Password:</strong> ${decryptedPassword}</p>
                    <button class="delete-btn fa fa-trash-o" data-id="${keyList[key]}" style="font-size:24px;color:red"></button>
                    <button class="copy-btn fa fa-clipboard" data-id="${keyList[key]}" style="font-size:24px;color:grey"></button>
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

            // attach add to clipboard to each copy button
            document.querySelectorAll('.copy-btn').forEach((button) => {
              button.addEventListener('click', (e) => {
                const parent = button.parentElement
                navigator.clipboard.writeText(parent.children[3].innerText.substring(9));
                
                // Clears the password from the clipboard...doesn't actually clear it...just writes a space " " so it cannot be 
                // easily pasted on accident later or by another user later
                setTimeout(() => {
                  navigator.clipboard.writeText(" "); // works on occasion...when window is in focus I believe
                }, 30000);
              });
          });

          document.getElementById("num-entries").innerHTML = "<strong>Entry Count: </strong>" + numEntries;
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