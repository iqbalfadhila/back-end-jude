const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const { 
   getAllStyle,
   getStyleById,
   createStyle,
   updateStyle,
   deleteStyle
} = require('../controllers/StyleController');

const router = express.Router();

router.get('/', authenticateToken, getAllStyle);
router.get('/:id', authenticateToken, getStyleById);
router.post('/', authenticateToken, createStyle);
router.put('/:id', authenticateToken, updateStyle);
router.delete('/:id', authenticateToken, deleteStyle);

module.exports = router;