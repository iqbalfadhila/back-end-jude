// src/models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Store = require('./Store');
const Category = require('./Category');
const Style = require('./Style');

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

Store.hasMany(Product);
Product.belongsTo(Store);

Category.hasMany(Product);
Product.belongsTo(Category);

Style.hasMany(Product);
Product.belongsTo(Style);

module.exports = Product;