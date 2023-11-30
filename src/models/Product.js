// src/models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Store = require('./Store');

const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  file_psd: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  file_mockup: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Menunjukkan bahwa Store memiliki banyak Product
Store.hasMany(Product);
// Menunjukkan bahwa Product dimiliki oleh satu Store
Product.belongsTo(Store);

module.exports = Product;
