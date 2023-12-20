const User = require("../models/User");
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const multer = require('multer');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../config/serviceAccountKey.json'),
  projectId: 'jude-406314',
});

const bucket = storage.bucket('storage_jude');

// const imageFilter = (req, file, cb) => {
//   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//     return cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
//   }
//   cb(null, true);
// };

const upload = multer({
  storage: multer.memoryStorage(),
  // limits: {
  //   fileSize: 2 * 1024 * 1024, // Batas 2 MB
  // },
  // fileFilter: imageFilter,
});

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, fullname, phone, gender, date_of_birth } = req.body;

    const existingUser = await User.findByPk(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedUserData = {
      username: username || existingUser.username,
      email: email || existingUser.email,
      fullname: fullname || existingUser.fullname,
      phone: phone || existingUser.phone,
      gender: gender || existingUser.gender,
      date_of_birth: date_of_birth || existingUser.date_of_birth,
    };

    if (req.file) {
      const file = req.file;
      
      // Validasi format file
      if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan!' });
      }
      // Validasi ukuran file
      if (file.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file foto melebihi batas 2 MB.' });
      }

      // Ubah ini menjadi folder yang diinginkan, misalnya "profileuser"
      const folderName = "profileuser";

      const fileName = `${folderName}/user_${userId}_${Date.now()}${path.extname(file.originalname)}`;
      const fileBuffer = file.buffer;

      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        console.error('Error uploading file to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading file to Google Cloud Storage' });
      });

      blobStream.on('finish', async () => {
        updatedUserData.photo = fileName;
        await existingUser.update(updatedUserData);
        res.json({ message: 'User data updated successfully.' });
      });

      blobStream.end(fileBuffer);
    } else {
      await existingUser.update(updatedUserData);
      res.json({ message: 'User data updated successfully.' });
    }
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user by ID:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if the user exists
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Delete the user
    await user.destroy();

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserPhotoUrl = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingUser = await User.findByPk(userId);
    console.log(existingUser);

    if (!existingUser) {
      return res.status(404).json({ message: 'User tidak ada.' });
    }

    const photoUrl = existingUser.photo;

    if (!photoUrl) {
      return res.status(404).json({ message: 'User photo not found.' });
    }

    // Ganti URL bucket dan path sesuai dengan struktur penyimpanan Anda
    const photoStorageUrl = `https://storage.googleapis.com/bucket-jude-406606/${photoUrl}`;

    res.json({ photoUrl: photoStorageUrl });
  } catch (error) {
    console.error('Error getting user photo:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  updateUser,
  upload,
  getAllUser,
  getUserById,
  deleteUser,
  getUserPhotoUrl,
};
