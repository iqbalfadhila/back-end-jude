// src/models/UserAddress.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const City = require('./City');

const UserAddress = sequelize.define('user_addresses', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  portal_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

City.hasMany(UserAddress, { foreignKey: 'id_city'});
UserAddress.belongsTo(City, { foreignKey: 'id_city'});


module.exports = UserAddress;
