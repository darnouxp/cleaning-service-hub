'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('quotations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'clientprofiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      serviceCatalogIds: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: false
      },
      propertyType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      frequency: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customerEmail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customerPhone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      zipcode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      squareFootage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      poolSize: {
        type: Sequelize.STRING,
        allowNull: true
      },
      exteriorFlooringSize: {
        type: Sequelize.STRING,
        allowNull: true
      },
      yardSize: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bedrooms: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      bathrooms: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      preferredDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      preferredTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      specialInstructions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      status: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'pending'
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
    await queryInterface.dropTable('quotations');
  }
}; 