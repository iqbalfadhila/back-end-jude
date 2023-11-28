const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Province = require('./Province');
const UserAddress = require('./UserAddress');

const City = sequelize.define('cities', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  // id_province: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: Province,
  //     key: 'id',
  //   },
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // },
  city_name: {
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
Province.hasMany(City, { foreignKey: 'id_province'});
City.belongsTo(Province, { foreignKey: 'id_province'});

module.exports = City;
