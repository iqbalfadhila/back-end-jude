// src/models/Province.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const City = require('./City');

const Province = sequelize.define('provinces', {
  id_province: {
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

// Definisi hubungan dengan model City (one-to-many)
Province.associate = models => {
  Province.hasMany(models.City, { as: 'cities', foreignKey: 'id_province' });
};

module.exports = Province;
