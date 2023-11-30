// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const provinceRoutes = require('./routes/provinceRoutes');
const cityRoutes = require('./routes/cityRoutes');
const userAddressRoutes = require('./routes/userAddressRoutes');
const userRoutes = require('./routes/userRoutes')
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const authenticateToken = require('./middleware/authenticateToken');
const authorizeRole = require('./middleware/authorizeRole');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
// Autentikasi JWT middleware
app.use('/api/province', authenticateToken, provinceRoutes);
app.use('/api/city', authenticateToken, cityRoutes);
app.use('/api/user-address', authenticateToken, userAddressRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/store', authenticateToken, storeRoutes);
app.use('/api/product', authenticateToken, productRoutes);

// app.get ("/test", authenticateToken, async (res, req) => {
//   // const province = await Province.findByPk(1);
//   // const cities = await province.getCities();

//   // // Menampilkan nama-nama kota
//   // cities.forEach(city => {
//   //   console.log(city.city_name);
//   // });
//   // const city = await City.findByPk(1);
//   // const province = await city.getProvince();

//   // console.log(province);
// })

app.get('/user', authenticateToken, authorizeRole('user'), (req, res) => {
  res.json({ message: 'Halo, pengguna biasa!' });
});
// Sync database dan jalankan server
sequelize.sync({force: false}).then(() => {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
});
