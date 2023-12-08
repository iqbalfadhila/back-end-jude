<<<<<<< HEAD
const express = require('express');
const styleController = require('../controllers/StyleController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/', authenticateToken, styleController.getAllStyle);
router.get('/:id', authenticateToken, styleController.getStyleById);
router.post('/', authenticateToken, styleController.createStyle);
router.put('/:id', authenticateToken, styleController.updateStyle);
router.delete('/:id', authenticateToken, styleController.deleteStyle);

=======
const express = require('express');
const styleController = require('../controllers/styleController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/', authenticateToken, styleController.getAllStyle);
router.get('/:id', authenticateToken, styleController.getStyleById);
router.post('/', authenticateToken, styleController.createStyle);
router.put('/:id', authenticateToken, styleController.updateStyle);
router.delete('/:id', authenticateToken, styleController.deleteStyle);

>>>>>>> a1de2a0618c3f9501131560ed1bb04cff20dd316
module.exports = router;