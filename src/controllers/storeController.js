// src/controllers/storeController.js
const User = require('../models/User');
const Store = require('../models/Store');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const multer = require('multer');
const { Op } = require('sequelize');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../config/serviceAccountKey.json'), // Replace with the path to your key file
  projectId: 'jude-406606', // Replace with your Google Cloud Project ID
});

const bucket = storage.bucket('bucket-jude-406606'); // Replace with your Google Cloud Storage bucket name

const upload = multer({storage: multer.memoryStorage()});

const createStore = async (req, res) => {
  const { store_name, description, email_store, phone_store } = req.body;

  try {
    const userId = req.user.id;

    // Cek apakah pengguna sudah memiliki toko
    const existingStore = await User.findByPk(userId);

    if (existingStore.id_store !== null) {
      return res.status(400).json({ message: 'Anda sudah memiliki toko.' });
    }

    const storeWithNameExists = await Store.findOne({ where: { store_name } });

    if (storeWithNameExists) {
      return res.status(400).json({ message: 'Nama toko sudah digunakan. Silakan pilih nama lain.' });
    }

    // Ambil file gambar dari request
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const backgroundFile = req.files['background'] ? req.files['background'][0] : null;

    // Validasi format dan ukuran file untuk photo
    if (photoFile) {
      if (!photoFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk photo!' });
      }

      if (photoFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file photo melebihi batas 2 MB.' });
      }
    }

    // Validasi format dan ukuran file untuk background
    if (backgroundFile) {
      if (!backgroundFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk background!' });
      }

      if (backgroundFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file background melebihi batas 2 MB.' });
      }
    }

    // Buat toko baru
    const newStore = await Store.create({ store_name, description, email_store, phone_store });

    // Simpan file photo ke Google Cloud Storage
    if (photoFile) {
      const folderName = "profileStore";
      const fileNamePhoto = `${folderName}/store_${newStore.id}_photo_${Date.now()}${path.extname(photoFile.originalname)}`;
      const fileBufferPhoto = photoFile.buffer;

      const blobPhoto = bucket.file(fileNamePhoto);
      const blobStreamPhoto = blobPhoto.createWriteStream();

      blobStreamPhoto.on('error', (err) => {
        console.error('Error uploading photo to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading photo to Google Cloud Storage' });
      });

      blobStreamPhoto.on('finish', async () => {
        await newStore.update({ photo: fileNamePhoto });
      });

      blobStreamPhoto.end(fileBufferPhoto);
    }

    // Simpan file background ke Google Cloud Storage
    if (backgroundFile) {
      const folderName = "profileStore";
      const fileNameBackground = `${folderName}/store_${newStore.id}_background_${Date.now()}${path.extname(backgroundFile.originalname)}`;
      const fileBufferBackground = backgroundFile.buffer;

      const blobBackground = bucket.file(fileNameBackground);
      const blobStreamBackground = blobBackground.createWriteStream();

      blobStreamBackground.on('error', (err) => {
        console.error('Error uploading background to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading background to Google Cloud Storage' });
      });

      blobStreamBackground.on('finish', async () => {
        await newStore.update({ background: fileNameBackground });
      });

      blobStreamBackground.end(fileBufferBackground);
    }

    // Perbarui role pengguna menjadi "designer" dan simpan ID toko
    await User.update({ role: 'designer', id_store: newStore.id }, { where: { id: userId } });

    res.status(201).json({ message: 'Toko berhasil dibuka.' });
  } catch (error) {
    console.error('Error opening store:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateStore = async (req, res) => {
  const { store_name, description, email_store, phone_store } = req.body;
  const userId = req.user.id;

  try {
    // Cek apakah pengguna memiliki toko
    const existingStore = await User.findByPk(userId);

    if (!existingStore.id_store) {
      return res.status(404).json({ message: 'Toko tidak ditemukan.' });
    }

    const storeWithNameExists = await Store.findOne({
      where: { store_name, id: { [Op.not]: existingStore.id_store } }
    });

    if (storeWithNameExists) {
      return res.status(400).json({ message: 'Nama toko sudah digunakan. Silakan pilih nama lain.' });
    }

    const userStoreId = existingStore.id_store;

    // Ambil file gambar dari request
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const backgroundFile = req.files['background'] ? req.files['background'][0] : null;

    // Validasi format dan ukuran file untuk photo
    if (photoFile) {
      if (!photoFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk photo!' });
      }

      if (photoFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file photo melebihi batas 2 MB.' });
      }
    }

    // Validasi format dan ukuran file untuk background
    if (backgroundFile) {
      if (!backgroundFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk background!' });
      }

      if (backgroundFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file background melebihi batas 2 MB.' });
      }
    }

    // Update informasi toko
    await Store.update(
      { store_name, description, email_store, phone_store },
      { where: { id: userStoreId } }
    );

    // Simpan file photo ke Google Cloud Storage
    if (photoFile) {
      const folderName = "profileStore";
      const fileNamePhoto = `${folderName}/store_${userStoreId}_photo_${Date.now()}${path.extname(photoFile.originalname)}`;
      const fileBufferPhoto = photoFile.buffer;

      const blobPhoto = bucket.file(fileNamePhoto);
      const blobStreamPhoto = blobPhoto.createWriteStream();

      blobStreamPhoto.on('error', (err) => {
        console.error('Error uploading photo to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading photo to Google Cloud Storage' });
      });

      blobStreamPhoto.on('finish', async () => {
        // Update data toko dengan URL foto baru
        await Store.update({ photo: fileNamePhoto }, { where: { id: userStoreId } });
      });

      blobStreamPhoto.end(fileBufferPhoto);
    }

    // Simpan file background ke Google Cloud Storage
    if (backgroundFile) {
      const folderName = "profileStore";
      const fileNameBackground = `${folderName}/store_${userStoreId}_background_${Date.now()}${path.extname(backgroundFile.originalname)}`;
      const fileBufferBackground = backgroundFile.buffer;

      const blobBackground = bucket.file(fileNameBackground);
      const blobStreamBackground = blobBackground.createWriteStream();

      blobStreamBackground.on('error', (err) => {
        console.error('Error uploading background to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading background to Google Cloud Storage' });
      });

      blobStreamBackground.on('finish', async () => {
        // Update data toko dengan URL background baru
        await Store.update({ background: fileNameBackground }, { where: { id: userStoreId } });
      });

      blobStreamBackground.end(fileBufferBackground);
    }

    res.json({ message: 'Informasi toko berhasil diperbarui.' });
  } catch (error) {
    console.error('Error updating store:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllStore = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    console.error('Error getting all stores:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getStoreById = async (req, res) => {
  const storeId = req.params.id;

  try {
    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({ message: 'Toko tidak ditemukan.' });
    }

    res.json(store);
  } catch (error) {
    console.error('Error getting store by ID:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteStore = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
  
    try {
      // Cek apakah pengguna memiliki toko
        const store = await Store.findByPk(id);

        if (!store) {
        return res.status(404).json({ message: 'store not found.' });
        }

        await store.destroy();
  
      // Reset role pengguna menjadi "user" dan hapus ID toko
      await User.update({ role: 'user', id_store: null }, { where: { id: userId } });
  
      res.json({ message: 'Toko berhasil dihapus.' });
    } catch (error) {
      console.error('Error deleting store:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};
  
  module.exports = {
    createStore,
    upload,
    updateStore,
    getAllStore,
    getStoreById,
    deleteStore,
  };
