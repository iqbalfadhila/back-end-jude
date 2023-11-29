// src/routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authenticateToken = require('../middleware/authenticateToken');
// const authorizeRole = require('../middleware/authorizeRole');

// Routes for managing stores
router.post('/open', authenticateToken, storeController.createStore);
router.put('/update', authenticateToken, storeController.updateStore);
router.get('/', authenticateToken, storeController.getAllStore);
router.get('/:id', authenticateToken, storeController.getStoreById);
router.delete('/:id', authenticateToken, storeController.deleteStore);

module.exports = router;
