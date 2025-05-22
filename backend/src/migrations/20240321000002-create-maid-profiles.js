'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('maidprofiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        type: Sequelize.TEXT
      },
      hourlyRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      experience: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      services: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      availability: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0
      },
      totalReviews: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add unique constraint for userId
    await queryInterface.addIndex('maidprofiles', ['userId'], {
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('maidprofiles');
  }
}; 