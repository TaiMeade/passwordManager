# Help Document
* When the database stops working (specifically Uncaught NotFoundError: Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found.) go to developer tools, Application tab, and delete the IndexedDB "Password Manager" database
  * This can also be used to reset the database.