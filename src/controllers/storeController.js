// src/controllers/storeController.js
const User = require('../models/User');
const Store = require('../models/Store');

const createStore = async (req, res) => {
  const { store_name, photo, background, description } = req.body;

  try {
    const storeId = req.user.id_store;
    // Cek apakah pengguna sudah memiliki toko
    const existingStore = await Store.findByPk(storeId);

    if (existingStore) {
      return res.status(400).json({ message: 'Anda sudah memiliki toko.' });
    }

    // Buat toko baru
    const newStore = await Store.create({ 
        store_name,
        photo,
        background,
        description,
    });

    // Perbarui role pengguna menjadi "designer" dan simpan ID toko
    await User.update({ role: 'designer', id_store: newStore.id }, { where: { id: userId } });

    res.status(201).json({ message: 'Toko berhasil dibuka.' });
  } catch (error) {
    console.error('Error opening store:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateStore = async (req, res) => {
  const { store_name, photo, background, description } = req.body;
  const storeId = req.user.id_store;
  console.log(req.user);

  try {
    // Cek apakah pengguna memiliki toko
    const existingStore = await Store.findByPk(storeId);

    if (!existingStore) {
      return res.status(404).json({ message: 'Toko tidak ditemukan.' });
    }

    // Perbarui informasi toko
    await existingStore.update({ 
      store_name,
      photo,
      background,
      description,
    });

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
    updateStore,
    getAllStore,
    getStoreById,
    deleteStore,
  };
