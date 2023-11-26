'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: true // Ubah menjadi true jika ingin membolehkan fullname kosong
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true // Ubah menjadi true jika ingin membolehkan phone kosong
      },
      id_address: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'user_addresses',
          key: 'id_address',
        },
        onDelete: 'SET NULL', // Atur sesuai kebutuhan (SET NULL, CASCADE, dll.)
        onUpdate: 'CASCADE',
      },
    
      photo: {
        type: Sequelize.STRING,
        allowNull: true // Ubah menjadi true jika ingin membolehkan photo kosong
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female'),
        allowNull: true // Ubah menjadi true jika ingin membolehkan gender kosong
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true // Ubah menjadi false jika ingin memastikan date_of_birth tidak boleh kosong
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};