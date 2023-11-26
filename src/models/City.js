const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Province = require('./Province');

const City = sequelize.define('cities', {
  id_city: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_province: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Province,
      key: 'id_province',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
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

// Menetapkan hubungan belongsTo
// City.belongsTo(Province, { foreignKey: 'id_province' });


City.associate = (models) => {
    City.belongsTo(models.Province, {
      as: 'province', // Optional: Set an alias for the association
      foreignKey: 'id_province',
    });
  };
module.exports = City;
