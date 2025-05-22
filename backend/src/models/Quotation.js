const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Quotation extends Model {
    static associate(models) {
      // associations can be defined here
      Quotation.belongsTo(models.User, { foreignKey: 'clientId', as: 'client' });
      Quotation.belongsTo(models.User, { foreignKey: 'maidId', as: 'maid' });
    }
  }

  Quotation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    maidId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    serviceType: {
      type: DataTypes.ARRAY(DataTypes.ENUM(
        'GENERAL_CLEANING',
        'DEEP_CLEANING',
        'MOVE_IN_OUT',
        'POST_CONSTRUCTION',
        'WINDOW_CLEANING',
        'POOL_CLEANING',
        'EXTERIOR_CLEANING',
        'APPLIANCE_CLEANING',
        'MAID_SERVICE'
      )),
      allowNull: false
    },
    propertyType: {
      type: DataTypes.ENUM(
        'APARTMENT',
        'HOUSE',
        'CONDO',
        'OFFICE',
        'OTHER'
      ),
      allowNull: false
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    squareFootage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estimatedDuration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false
    },
    estimatedPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    specialRequirements: {
      type: DataTypes.TEXT,
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
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurringPattern: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    guestName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    guestEmail: {
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