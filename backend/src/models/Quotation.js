'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Quotation extends Model {
    static associate(models) {
      // associations can be defined here
      Quotation.belongsTo(models.User, { foreignKey: 'customerId', as: 'customer' });

    }
  }

  Quotation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: () => uuidv4(), // Generate a temporary UUID if no user
      references: {
        model: 'users',
        key: 'id'
      }
    },
    serviceCatalogIds: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true
    },
    propertyType: {
      type: DataTypes.ENUM(
        'APARTMENT',
        'HOUSE',
        'CONDO',
        'OFFICE',
        'OTHER'
      ),
      allowNull: true
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    squareFootage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'ACCEPTED',
        'REJECTED',
        'EXPIRED'
      ),
      defaultValue: 'PENDING'
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'The price quoted for the service'
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preferredDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isValidDate(value) {
          if (value && isNaN(new Date(value).getTime())) {
            throw new Error('Invalid date format');
          }
        }
      }
    },
    preferredTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Quotation',
    tableName: 'quotations',
    timestamps: true
  });

  return Quotation;
}; 