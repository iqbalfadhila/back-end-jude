// src/routes/provinceRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const provinceController = require('../controllers/provinceController');

router.get('/', authenticateToken, provinceController.getAllProvinces);
router.get('/:id', authenticateToken, provinceController.getProvinceById);
router.post('/', authenticateToken, provinceController.createProvince);
router.put('/:id', authenticateToken, provinceController.updateProvince);
router.delete('/:id', authenticateToken, provinceController.deleteProvince);

module.exports = router;
