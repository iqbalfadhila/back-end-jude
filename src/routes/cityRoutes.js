// src/routes/cityRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const cityController = require('../controllers/cityController');

router.get('/', authenticateToken, cityController.getAllCities);
router.get('/:id', authenticateToken, cityController.getCityById);
router.post('/', authenticateToken, cityController.createCity);
router.put('/:id', authenticateToken, cityController.updateCity);
router.delete('/:id', authenticateToken, cityController.deleteCity);
router.get('/byProvince/:id_province', authenticateToken, cityController.getAllCitiesByProvinceId);

module.exports = router;
