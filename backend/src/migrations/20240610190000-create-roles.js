'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true
      },
      name: {
        type: Sequelize.ENUM('ADMIN', 'MAID', 'CLIENT'),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      permissions: {
        type: Sequelize.JSON,
        defaultValue: {}
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

    // Insert default roles
    await queryInterface.bulkInsert('roles', [
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        name: 'ADMIN',
        description: 'Administrator with full access',
        permissions: JSON.stringify({
          manageUsers: true,
          manageRoles: true,
          manageBookings: true,
          manageQuotations: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        name: 'MAID',
        description: 'Cleaning professional',
        permissions: JSON.stringify({
          manageProfile: true,
          viewBookings: true,
          manageAvailability: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        name: 'CLIENT',
        description: 'Customer',
        permissions: JSON.stringify({
          manageProfile: true,
          createBookings: true,
          createQuotations: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
  }
}; 