// src/routes/userAddressRoutes.js
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const {
  createUserAddress,
  getUserAddresses,
  updateUserAddress,
  deleteUserAddress,
} = require('../controllers/userAddressController');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('user'), createUserAddress);
router.get('/', authenticateToken, getUserAddresses);
router.put('/update', authenticateToken, authorizeRole('user'), updateUserAddress);
router.delete('/:id', authenticateToken, deleteUserAddress);

module.exports = router;
