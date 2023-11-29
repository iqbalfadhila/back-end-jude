// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Menggunakan objek User dari models
const { Op } = require('sequelize');

const register = async (req, res) => {
  const { username, email, password, fullname, phone, gender, date_of_birth } = req.body;

  // // Validasi bahwa semua field harus diisi
  // if (!username || !email || !password || !fullname || !phone || !gender || !date_of_birth) {
  //   return res.status(400).json({ message: 'All fields must be filled in.' });
  // }
  // Validasi bahwa semua field harus diisi
  if (!username) {
    return res.status(400).json({ message: 'Username must be filled in.' });
  }

  if (!email) {
    return res.status(400).json({ message: 'Email must be filled in.' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password must be filled in.' });
  }

  if (!fullname) {
    return res.status(400).json({ message: 'Fullname must be filled in.' });
  }

  if (!phone) {
    return res.status(400).json({ message: 'Phone must be filled in.' });
  }

  if (!gender) {
    return res.status(400).json({ message: 'Gender must be filled in.' });
  }

  if (!date_of_birth) {
    return res.status(400).json({ message: 'Date of birth must be filled in.' });
  }

  // Validasi format email menggunakan regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Validasi format nomor telepon Indonesia
  const phoneRegex = /^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format.' });
  }

  try {
    // Periksa apakah username, email, phone sudah terdaftar
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }, { phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username/Email/Phone has been registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      username, 
      email, 
      password: hashedPassword,
      fullname,
      phone,
      gender,
      date_of_birth,
    });

    res.status(201).json({ message: 'Registration successful.' });
  } catch (error) {
    console.error('Error registering user:', error.message);

    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Menggunakan [Op.or] untuk mencari berdasarkan email, username, atau phone
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier },
          { phone: identifier }
        ]
      }
    });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const accessToken = jwt.sign({ id: user.id, role: user.role, id_store: user.id_store }, process.env.SECRET_KEY, { expiresIn: '1h', algorithm: 'HS256' });
        res.json({ accessToken });
      } else {
        res.status(401).json({ message: 'Login failed. Double check your Username/Email/Phone and password.' });
      }
    } else {
      res.status(401).json({ message: 'Login failed. Double check your Username/Email/Phone and password.' });
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
