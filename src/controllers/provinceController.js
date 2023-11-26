// src/controllers/provinceController.js
const Province = require('../models/Province');

const getAllProvinces = async (req, res) => {
  try {
    const provinces = await Province.findAll();
    res.json(provinces);
  } catch (error) {
    console.error('Error getting provinces:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getProvinceById = async (req, res) => {
  const { id } = req.params;

  try {
    const province = await Province.findByPk(id);

    if (!province) {
      return res.status(404).json({ message: 'Province not found.' });
    }

    res.json(province);
  } catch (error) {
    console.error('Error getting province by ID:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createProvince = async (req, res) => {
  const { province_name } = req.body;

  try {
    const newProvince = await Province.create({ province_name });
    res.status(201).json(newProvince);
  } catch (error) {
    console.error('Error creating province:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateProvince = async (req, res) => {
  const { id } = req.params;
  const { province_name } = req.body;

  try {
    const province = await Province.findByPk(id);

    if (!province) {
      return res.status(404).json({ message: 'Province not found.' });
    }

    await province.update({ province_name });
    res.json(province);
  } catch (error) {
    console.error('Error updating province:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteProvince = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Cek apakah provinsi dengan ID yang diberikan ada
      const existingProvince = await Province.findByPk(id);
  
      if (!existingProvince) {
        return res.status(404).json({ message: 'Province not found.' });
      }
  
      // Hapus provinsi dan kaskade delete akan menghapus kota yang terkait
      await existingProvince.destroy();
  
      res.json({ message: 'Province and related cities deleted successfully.' });
    } catch (error) {
      console.error('Error deleting province:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

module.exports = {
  getAllProvinces,
  getProvinceById,
  createProvince,
  updateProvince,
  deleteProvince,
};
