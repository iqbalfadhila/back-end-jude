// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const provinceRoutes = require('./routes/provinceRoutes');
const cityRoutes = require('./routes/cityRoutes');
// const userAddressRoutes = require('./routes/userAddressRoutes')
const authenticateToken = require('./middleware/authenticateToken');
const sequelize = require('./config/db');
const City = require('./models/City');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
// Autentikasi JWT middleware
app.use('/api/province', authenticateToken, provinceRoutes);
app.use('/api/city', authenticateToken, cityRoutes); // Menambahkan route untuk City
// app.use('/api/user-address', authenticateToken, userAddressRoutes);

app.get ("/test", authenticateToken, async (res, req) => {
    const city = await City.findOne({ where: { id_city: 1 } });
    const province = await city.getProvince(); // or city.getProvince({ raw: true }) for plain JSON data
    console.log(province);
})

// Sync database dan jalankan server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
});
