// src/routes/provinceRoutes.js
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const { 
   getAllProvinces,
   getProvinceById,
   createProvince,
   updateProvince,
   deleteProvince,
} = require('../controllers/provinceController');

const router = express.Router();

router.get('/', getAllProvinces);
router.get('/:id', getProvinceById);
router.post('/', authenticateToken, createProvince);
router.put('/:id', authenticateToken, updateProvince);
router.delete('/:id', authenticateToken, deleteProvince);

module.exports = router;
