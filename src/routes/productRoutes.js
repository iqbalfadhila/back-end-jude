// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authenticateToken');

// Rute untuk membuat produk baru
router.post('/create', authenticateToken, productController.createProduct);

// Rute untuk mendapatkan semua produk di dalam toko
router.get('/all', authenticateToken, productController.getAllProducts);

// Rute untuk mendapatkan produk berdasarkan ID
router.get('/:id', authenticateToken, productController.getProductById);

// Rute untuk memperbarui produk
router.put('/:id/update', authenticateToken, productController.updateProduct);

// Rute untuk menghapus produk
router.delete('/:id/delete', authenticateToken, productController.deleteProduct);

module.exports = router;
