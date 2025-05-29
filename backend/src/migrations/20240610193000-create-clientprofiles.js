'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clientprofiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      serviceArea: {
        type: Sequelize.STRING,
        allowNull: false
      },
      requiredServices: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      preferences: {
        type: Sequelize.JSON,
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

    // Add unique constraint for userId (one client profile per user)
    await queryInterface.addConstraint('clientprofiles', {
      fields: ['userId'],
      type: 'unique',
      name: 'unique_clientprofile_user'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clientprofiles');
  }
}; 