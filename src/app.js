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
const favoriteRoutes = require('./routes/favoriteRoutes');
const cartRoute = require('./routes/cartRoutes');
const authenticateToken = require('./middleware/authenticateToken');
const authorizeRole = require('./middleware/authorizeRole');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/province', provinceRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/user-address', userAddressRoutes);
app.use('/api/user', userRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/style', styleRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/cart', cartRoute);

app.get('/user', authenticateToken, authorizeRole('user'), (req, res) => {
  res.json({ message: 'Halo, pengguna biasa!' });
});
// Sync database dan jalankan server
sequelize.sync({force: true}).then(() => {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
});