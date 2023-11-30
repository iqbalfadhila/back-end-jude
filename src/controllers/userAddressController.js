// src/controllers/userAddressController.js
// const { where } = require('sequelize');
const UserAddress = require('../models/UserAddress');
const User = require('../models/User');
const City = require('../models/City');

const getUserAddresses = async (req, res) => {
  try {
    const userAddresses = await UserAddress.findAll();
    res.json(userAddresses);
  } catch (error) {
    console.error('Error getting user addresses:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createUserAddress = async (req, res) => {
  const { id_city, address, portal_code } = req.body;

  try {
    // Validasi bahwa semua field harus diisi
    if (!id_city || !address || !portal_code) {
      return res.status(400).json({ message: 'All fields must be filled in.' });
    }

    // Mendapatkan id pengguna dari req.user
    const userId = req.user.id;

    // Cek apakah id_city ada di tabel cities
    const existingCity = await City.findByPk(id_city);

    if (!existingCity) {
      return res.status(400).json({ message: 'Invalid id_city. City not found.' });
    }

    // Cek apakah pengguna sudah memiliki alamat
    const existingUser = await User.findByPk(userId);

    if (existingUser.id_address !== null) {
      return res.status(400).json({ message: 'User already has an address.' });
    }

    // Membuat user_address dengan mengisi id_address dengan id pengguna
    const newUserAddress = await UserAddress.create({
      id_city,
      address,
      portal_code,
    });

    // Update id_address pada pengguna
    await User.update({ id_address: newUserAddress.id }, { where: { id: userId } });

    res.status(201).json(newUserAddress);
  } catch (error) {
    console.error('Error creating user address:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateUserAddress = async (req, res) => {
  const { id_city, address, portal_code } = req.body;

  try {
    // Validasi bahwa semua field harus diisi
    if (!id_city || !address || !portal_code) {
      return res.status(400).json({ message: 'All fields must be filled in.' });
    }

    // Mendapatkan id pengguna dari req.user
    const userId = req.user.id;

    // Cek apakah id_city ada di tabel cities
    const existingCity = await City.findByPk(id_city);

    if (!existingCity) {
      return res.status(400).json({ message: 'Invalid id_city. City not found.' });
    }

    // Cek apakah pengguna sudah memiliki alamat
    const existingUser = await User.findByPk(userId);

    if (!existingUser || existingUser.id_address === null) {
      return res.status(404).json({ message: 'User address not found.' });
    }

    // Mendapatkan id alamat pengguna
    const addressId = existingUser.id_address;

    // Update user_address dengan mengisi id_address dengan id pengguna
    await UserAddress.update({
      id_city,
      address,
      portal_code,
    }, { where: { id: addressId } });

    res.json({ message: 'User address updated successfully.' });
  } catch (error) {
    console.error('Error updating user address:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// const updateUserAddress = async (req, res) => {
//   const { id } = req.params;
//   const { id_city, address, portal_code } = req.body;

//   try {
//    // Validasi bahwa semua field harus diisi
//         if (!id_city || !address || !portal_code) {
//           return res.status(400).json({ message: 'All fields must be filled in.' });
//         }

//     // Cek apakah id_city ada di tabel cities
//     const existingCity = await City.findByPk(id_city);

//     if (!existingCity) {
//       return res.status(400).json({ message: 'Invalid id_city. City not found.' });
//     }

//     // Cek apakah user_address dengan ID yang diberikan ada
//     const existingUserAddress = await UserAddress.findByPk(id);

//     if (!existingUserAddress) {
//       return res.status(404).json({ message: 'User Address not found.' });
//     }

//     // Lakukan pembaruan pada user_address
//     await existingUserAddress.update({ id_city, address, portal_code });

//     res.json(existingUserAddress);
//   } catch (error) {
//     console.error('Error updating user address:', error.message);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

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
