const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const { 
   getAllCategories,
   getCategoryById,
   createCategory,
   updateCategory,
   deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/', authenticateToken, getAllCategories);
router.get('/:id', authenticateToken, getCategoryById);
router.post('/', authenticateToken, createCategory);
router.put('/:id', authenticateToken, updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

module.exports = router;