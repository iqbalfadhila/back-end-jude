// src/controllers/cityController.js
const City = require('../models/City');
const Province = require('../models/Province');

const getAllCities = async (req, res) => {
  try {
    const cities = await City.findAll();
    res.json(cities);
  } catch (error) {
    console.error('Error getting cities:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getCityById = async (req, res) => {
  const { id } = req.params;

  try {
    const city = await City.findByPk(id);

    if (!city) {
      return res.status(404).json({ message: 'City not found.' });
    }

    res.json(city);
  } catch (error) {
    console.error('Error getting city by ID:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createCity = async (req, res) => {
    const { id_province, city_name } = req.body;
  
    try {
      // Cek apakah id_province ada di tabel provinces
      const existingProvince = await Province.findByPk(id_province);
  
      if (!existingProvince) {
        return res.status(400).json({ message: 'Invalid id_province. Province not found.' });
      }
  
      // Jika id_province valid, buat kota baru
      const newCity = await City.create({ id_province, city_name });
      console.log(existingProvince.getCities())
      res.status(201).json(newCity);
    } catch (error) {
      console.error('Error creating city:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

  const updateCity = async (req, res) => {
    const { id } = req.params;
    const { id_province, city_name } = req.body;
  
    try {
      const city = await City.findByPk(id);
  
      if (!city) {
        return res.status(404).json({ message: 'City not found.' });
      }
  
      // Cek apakah id_province ada di tabel provinces
      const existingProvince = await Province.findByPk(id_province);
  
      if (!existingProvince) {
        return res.status(400).json({ message: 'Invalid id_province. Province not found.' });
      }
  
      // Jika id_province valid, lakukan pembaruan
      await city.update({ id_province, city_name });
      res.json(city);
    } catch (error) {
      console.error('Error updating city:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

const deleteCity = async (req, res) => {
  const { id } = req.params;

  try {
    const city = await City.findByPk(id);

    if (!city) {
      return res.status(404).json({ message: 'City not found.' });
    }

    await city.destroy();
    res.json({ message: 'City deleted successfully.' });
  } catch (error) {
    console.error('Error deleting city:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};
