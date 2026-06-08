const { safeStorage } = require('electron')

function encrypt(text) {
  if (safeStorage.isEncryptionAvailable()) {
    return safeStorage.encryptString(text).toString('base64')
  }
  return null
}

function decrypt(encryptedText) {
  try {
    const buffer = Buffer.from(encryptedText, 'base64')
    return safeStorage.decryptString(buffer)
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

module.exports = { encrypt, decrypt }
