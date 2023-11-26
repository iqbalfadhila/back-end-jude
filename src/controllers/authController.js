// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Menggunakan objek User dari models
const { Op } = require('sequelize');

const register = async (req, res) => {
    const { username, email, password } = req.body;
  
    // Validasi bahwa semua field harus diisi
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Semua field harus diisi.' });
    }
  
    try {
      // Periksa apakah username atau email sudah terdaftar
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Username atau email sudah terdaftar.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, email, password: hashedPassword });
  
      res.status(201).json({ message: 'Registrasi berhasil.' });
    } catch (error) {
      console.error('Error registering user:', error.message);
  
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h', algorithm: 'HS256'});
        res.json({ accessToken });
      } else {
        res.status(401).json({ message: 'Gagal login. Periksa kembali email dan password.' });
      }
    } else {
      res.status(401).json({ message: 'Gagal login. Periksa kembali email dan password.' });
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  register,
  login,
};
