const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const { updateUser, getAllUser, getUserById, deleteUser } = require('../controllers/userController');

// Tentukan tempat penyimpanan dan nama file
const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, 'src/uploads'); // Simpan file di folder 'uploads'
},
filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'user_' + Date.now() + ext); // Nama file: user_timestamp
},
});

// Konfigurasi multer
const upload = multer({ storage: storage });

// Menyajikan file gambar yang diunggah
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Route untuk mengupdate user
router.put('/update', upload.single('photo'), updateUser);
router.get('/', authenticateToken, getAllUser);
router.get('/:id', authenticateToken, getUserById);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
