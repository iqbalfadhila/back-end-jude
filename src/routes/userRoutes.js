const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const { updateUser, upload, getAllUser, getUserById, deleteUser, getUserPhotoUrl } = require('../controllers/userController');

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// Menyajikan file gambar yang diunggah
// router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

router.put('/update', authenticateToken, authorizeRole('user'), upload.single('photo'), updateUser);
router.get('/photo', authenticateToken, getUserPhotoUrl); // Tambahkan endpoint ini
router.get('/', authenticateToken, getAllUser);
router.get('/:id', authenticateToken, getUserById);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
