const DataTypes = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define('stores', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    store_name: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    background: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
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

module.exports = Store;
