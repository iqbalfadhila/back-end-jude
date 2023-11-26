// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const UserAddress = require('./UserAddress');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_address: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: {
    //   model: UserAddress,
    //   key: 'id_address',
    // },
    // onDelete: 'SET NULL', // Atur sesuai kebutuhan (SET NULL, CASCADE, dll.)
    // onUpdate: 'CASCADE',
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female'), // Sesuaikan dengan pilihan gender yang diinginkan
    allowNull: true, // Sesuaikan dengan kebutuhan, apakah boleh null atau tidak
  },

  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: true,
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

// Menunjukkan bahwa User memiliki satu alamat (UserAddress)
// User.hasOne(UserAddress, { foreignKey: 'id_address' });

module.exports = User;
