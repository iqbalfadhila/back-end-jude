const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { updateUser, getAllUser, getUserById, deleteUser } = require('../controllers/userController');

// Update user route
router.put('/update', authenticateToken, updateUser);
router.get('/', authenticateToken, getAllUser);
router.get('/:id', authenticateToken, getUserById);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
