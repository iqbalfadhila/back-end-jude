// src/routes/cityRoutes.js
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const { 
   getAllCities,
   getCityById,
   createCity,
   updateCity,
   deleteCity,
   getAllCitiesByProvinceId,
} = require('../controllers/cityController');

const router = express.Router();

router.get('/', getAllCities);
router.get('/:id', getCityById);
router.post('/', authenticateToken, createCity);
router.put('/:id', authenticateToken, updateCity);
router.delete('/:id', authenticateToken, deleteCity);
router.get('/byProvince/:id_province', getAllCitiesByProvinceId);

module.exports = router;