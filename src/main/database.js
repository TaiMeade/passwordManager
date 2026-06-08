const Database = require('better-sqlite3')
const path = require('path')
const { app } = require('electron')

let db

function init() {
  const dbPath = path.join(app.getPath('userData'), 'vault.db')
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  createTables()
}

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS passwords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service TEXT NOT NULL,
      email TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cardholder TEXT NOT NULL,
      card_number TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      cvv TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bank_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bank TEXT NOT NULL,
      routing TEXT NOT NULL,
      account TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_type TEXT NOT NULL,
      id_number TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    );
  `)
}

// --- Settings ---
function getSetting(id) {
  const row = db.prepare('SELECT value FROM settings WHERE id = ?').get(id)
  return row ? row.value : null
}

function setSetting(id, value) {
  db.prepare('INSERT OR REPLACE INTO settings (id, value) VALUES (?, ?)').run(id, value)
}

// --- Passwords ---
function addPassword({ service, email, username, password }) {
  db.prepare('INSERT INTO passwords (service, email, username, password) VALUES (?, ?, ?, ?)').run(service, email, username, password)
}

function getAllPasswords() {
  return db.prepare('SELECT * FROM passwords').all()
}

function deletePassword(id) {
  db.prepare('DELETE FROM passwords WHERE id = ?').run(id)
}

// --- Cards ---
function addCard({ cardholder, card_number, expiry_date, cvv }) {
  db.prepare('INSERT INTO cards (cardholder, card_number, expiry_date, cvv) VALUES (?, ?, ?, ?)').run(cardholder, card_number, expiry_date, cvv)
}

function getAllCards() {
  return db.prepare('SELECT * FROM cards').all()
}

function deleteCard(id) {
  db.prepare('DELETE FROM cards WHERE id = ?').run(id)
}

// --- Bank Accounts ---
function addBankAccount({ bank, routing, account }) {
  db.prepare('INSERT INTO bank_accounts (bank, routing, account) VALUES (?, ?, ?)').run(bank, routing, account)
}

function getAllBankAccounts() {
  return db.prepare('SELECT * FROM bank_accounts').all()
}

function deleteBankAccount(id) {
  db.prepare('DELETE FROM bank_accounts WHERE id = ?').run(id)
}

// --- IDs ---
function addId({ id_type, id_number }) {
  db.prepare('INSERT INTO ids (id_type, id_number) VALUES (?, ?)').run(id_type, id_number)
}

function getAllIds() {
  return db.prepare('SELECT * FROM ids').all()
}

function deleteId(id) {
  db.prepare('DELETE FROM ids WHERE id = ?').run(id)
}

// --- Notes ---
function addNote({ title, content }) {
  db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(title, content)
}

function getAllNotes() {
  return db.prepare('SELECT * FROM notes').all()
}

function deleteNote(id) {
  db.prepare('DELETE FROM notes WHERE id = ?').run(id)
}

// --- Search ---
function search(term) {
  const like = `%${term}%`

  const passwords = db.prepare(
    'SELECT *, \'password\' AS entry_type FROM passwords WHERE service LIKE ? OR email LIKE ? OR username LIKE ?'
  ).all(like, like, like)

  const cards = db.prepare(
    'SELECT *, \'card\' AS entry_type FROM cards WHERE cardholder LIKE ? OR card_number LIKE ?'
  ).all(like, like)

  const bankAccounts = db.prepare(
    'SELECT *, \'bank\' AS entry_type FROM bank_accounts WHERE bank LIKE ? OR routing LIKE ?'
  ).all(like, like)

  const ids = db.prepare(
    'SELECT *, \'id\' AS entry_type FROM ids WHERE id_type LIKE ?'
  ).all(like)

  const notes = db.prepare(
    'SELECT *, \'note\' AS entry_type FROM notes WHERE title LIKE ?'
  ).all(like)

  return [...passwords, ...cards, ...bankAccounts, ...ids, ...notes]
}

// --- Self-Destruct ---
function selfDestruct() {
  db.prepare('DELETE FROM passwords').run()
  db.prepare('DELETE FROM cards').run()
  db.prepare('DELETE FROM bank_accounts').run()
  db.prepare('DELETE FROM ids').run()
  db.prepare('DELETE FROM notes').run()
}

// --- Entry Count ---
function getEntryCount() {
  const result = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM passwords) +
      (SELECT COUNT(*) FROM cards) +
      (SELECT COUNT(*) FROM bank_accounts) +
      (SELECT COUNT(*) FROM ids) +
      (SELECT COUNT(*) FROM notes) AS total
  `).get()
  return result.total
}

module.exports = {
  init,
  getSetting,
  setSetting,
  addPassword, getAllPasswords, deletePassword,
  addCard, getAllCards, deleteCard,
  addBankAccount, getAllBankAccounts, deleteBankAccount,
  addId, getAllIds, deleteId,
  addNote, getAllNotes, deleteNote,
  search,
  selfDestruct,
  getEntryCount
}
