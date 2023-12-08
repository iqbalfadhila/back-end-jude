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
const categoryRoutes = require('./routes/categoryRoutes');
const styleRoutes = require('./routes/styleRoutes');
const authenticateToken = require('./middleware/authenticateToken');
const authorizeRole = require('./middleware/authorizeRole');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
// Autentikasi JWT middleware
app.use('/api/province', authenticateToken, provinceRoutes);
app.use('/api/city', authenticateToken, cityRoutes);
app.use('/api/user-address', authenticateToken, userAddressRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/store', authenticateToken, storeRoutes);
app.use('/api/product', authenticateToken, productRoutes);
app.use('/api/category', authenticateToken, categoryRoutes);
app.use('/api/style', authenticateToken, styleRoutes);

app.get('/user', authenticateToken, authorizeRole('user'), (req, res) => {
  res.json({ message: 'Halo, pengguna biasa!' });
});
// Sync database dan jalankan server
sequelize.sync({force: true}).then(() => {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
});