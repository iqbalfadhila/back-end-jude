// src/models/Province.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const City = require('./City')

const Province = sequelize.define('provinces', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  province_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Province.associate = models => {
//   Province.hasMany(models.City);
// };

module.exports = Province;
