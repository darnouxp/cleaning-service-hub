'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('maidprofiles', {
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
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      hourlyRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      availability: {
        type: Sequelize.JSON,
        allowNull: true
      },
      services: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      serviceAreas: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true
      },
      totalReviews: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true
      },
      backgroundCheck: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      insuranceInfo: {
        type: Sequelize.JSON,
        allowNull: true
      },
      emergencyContact: {
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

    // Add unique constraint for userId (one maid profile per user)
    await queryInterface.addConstraint('maidprofiles', {
      fields: ['userId'],
      type: 'unique',
      name: 'unique_maidprofile_user'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('maidprofiles');
  }
}; 