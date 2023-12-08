<<<<<<< HEAD
// src/routes/cityRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const cityController = require('../controllers/cityController');

router.get('/', authenticateToken, cityController.getAllCities);
router.get('/:id', authenticateToken, cityController.getCityById);
router.post('/', authenticateToken, cityController.createCity);
router.put('/:id', authenticateToken, cityController.updateCity);
router.delete('/:id', authenticateToken, cityController.deleteCity);
router.get('/byProvince/:id_province', authenticateToken, cityController.getAllCitiesByProvinceId);

module.exports = router;
=======
// src/routes/cityRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const cityController = require('../controllers/cityController');

router.get('/', authenticateToken, cityController.getAllCities);
router.get('/:id', authenticateToken, cityController.getCityById);
router.post('/', authenticateToken, cityController.createCity);
router.put('/:id', authenticateToken, cityController.updateCity);
router.delete('/:id', authenticateToken, cityController.deleteCity);

module.exports = router;
>>>>>>> a1de2a0618c3f9501131560ed1bb04cff20dd316
