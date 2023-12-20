// src/routes/storeRoutes.js
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const { 
   createStore,
   upload,
   updateStore,
   getAllStore,
   getStoreById,
   deleteStore,
   getAllProductsByStoreName
} = require('../controllers/storeController');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

router.post('/open', authenticateToken, upload.fields([
      { name: 'photo', maxCount: 1 },
      { name: 'background', maxCount: 1 }
   ]), authorizeRole("user"), createStore);
router.put('/update', authenticateToken, upload.fields([
      { name: 'photo', maxCount: 1 },
      { name: 'background', maxCount: 1 }
   ]), authorizeRole("designer"), updateStore);
router.get('/', getAllStore);
router.get('/:id', getStoreById);
router.delete('/:id', authenticateToken, deleteStore);
router.get('/products/:storeName', getAllProductsByStoreName);

module.exports = router;
