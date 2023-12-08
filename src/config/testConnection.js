// src/testConnection.js
const sequelize = require('./db');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil.');
  } catch (error) {
    console.error('Tidak dapat terhubung ke database:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Jalankan fungsi untuk menguji koneksi
testConnection();