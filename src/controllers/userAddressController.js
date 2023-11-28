// src/controllers/userAddressController.js
const { where } = require('sequelize');
const UserAddress = require('../models/UserAddress');
const User = require('../models/User');

const createUserAddress = async (req, res) => {
  const { id_city, address, portal_code } = req.body;

  // Validasi bahwa semua field harus diisi
  if (!id_city || !address || !portal_code) {
    return res.status(400).json({ message: 'Semua field harus diisi.' });
  }

  try {
    // Mendapatkan id pengguna dari req.user
    const userId = req.user.id;

    // Membuat user_address dengan mengisi id_address dengan id pengguna
    const newUserAddress = await UserAddress.create({
      id_city,
      address,
      portal_code,
      // id_address: userId, // Menggunakan id pengguna sebagai id_address
    });

    await User.update({ id_address: newUserAddress.id }, { where: { id: userId } });

    res.status(201).json(newUserAddress);
  } catch (error) {
    console.error('Error creating user address:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserAddresses = async (req, res) => {
  try {
    const userAddresses = await UserAddress.findAll();
    res.json(userAddresses);
  } catch (error) {
    console.error('Error getting user addresses:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateUserAddress = async (req, res) => {
  const { id } = req.params;
  const { id_city, address, portal_code } = req.body;

  try {
    const userAddress = await UserAddress.findByPk(id);

    if (!userAddress) {
      return res.status(404).json({ message: 'User address not found.' });
    }

    await userAddress.update({ id_city, address, portal_code });
    res.json(userAddress);
  } catch (error) {
    console.error('Error updating user address:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteUserAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const userAddress = await UserAddress.findByPk(id);

    if (!userAddress) {
      return res.status(404).json({ message: 'User address not found.' });
    }

    await userAddress.destroy();
    res.json({ message: 'User address deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user address:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createUserAddress,
  getUserAddresses,
  updateUserAddress,
  deleteUserAddress,
};
