const express = require('express');
const styleController = require('../controllers/StyleController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/', authenticateToken, styleController.getAllStyle);
router.get('/:id', authenticateToken, styleController.getStyleById);
router.post('/', authenticateToken, styleController.createStyle);
router.put('/:id', authenticateToken, styleController.updateStyle);
router.delete('/:id', authenticateToken, styleController.deleteStyle);

module.exports = router;