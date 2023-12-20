// src/routes/productRoutes.js
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const {
  createProduct,
  upload,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsByStore,
  getAllProductsByStyle,
  getAllProductsByCategory,
  getAllProductsFilter,
} = require('../controllers/productController');

const router = express.Router();

router.post('/create', authenticateToken, upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'file_psd', maxCount: 1 },
    { name: 'file_mockup', maxCount: 1 },
  ]), authorizeRole("designer"), createProduct);

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.put('/:id/update', authenticateToken, upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'file_psd', maxCount: 1 },
    { name: 'file_mockup', maxCount: 1 },
  ]), authorizeRole("designer"), updateProduct);

router.delete('/:id/delete', authorizeRole("designer"), authenticateToken, deleteProduct);

router.get('/store/:storeIdentifier', getAllProductsByStore);
router.get('/style/:styleIdentifier', getAllProductsByStyle);
router.get('/category/:categoryIdentifier', getAllProductsByCategory);

module.exports = router;
