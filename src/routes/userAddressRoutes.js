// src/routes/userAddressRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const {
  createUserAddress,
  getUserAddresses,
  updateUserAddress,
  deleteUserAddress,
} = require('../controllers/userAddressController');


// Endpoint CRUD user address
router.post('/', authenticateToken, createUserAddress);
router.get('/', authenticateToken, getUserAddresses);
router.put('/update', authenticateToken, updateUserAddress);
router.delete('/:id', authenticateToken, deleteUserAddress);

module.exports = router;
