'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true
      },
      maidId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'maidprofiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      clientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'clientprofiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      serviceDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      serviceTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      status: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      actual_start: {
        type: Sequelize.DATE,
        allowNull: true
      },
      actual_end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      price_cents: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bookings');
  }
}; 