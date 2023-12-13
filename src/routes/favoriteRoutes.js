const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const { 
   getAllFavorite,
   createFavorite,
   deleteFavorite,
} = require('../controllers/favoriteController');

const router = express.Router();

router.get('/all', authenticateToken, getAllFavorite);
router.post('/add', authenticateToken, createFavorite);
router.delete('/delete', authenticateToken, deleteFavorite);

module.exports = router;