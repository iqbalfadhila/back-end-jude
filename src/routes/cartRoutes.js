const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { addToCart, deleteFromCart, getAllCart } = require('../controllers/cartController');

router.post('/add', authenticateToken, addToCart);
router.delete('/delete', authenticateToken, deleteFromCart);
router.get('/all', authenticateToken, getAllCart);

module.exports = router;