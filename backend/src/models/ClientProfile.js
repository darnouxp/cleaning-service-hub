const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClientProfile extends Model {
    static associate(models) {
      // associations can be defined here
      ClientProfile.belongsTo(models.User, { foreignKey: 'userId' });
      ClientProfile.hasMany(models.Booking, { foreignKey: 'clientId' });
      ClientProfile.hasMany(models.Review, { foreignKey: 'clientId' });
    }
  }

  ClientProfile.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'ClientProfile',
    tableName: 'clientprofiles',
    timestamps: true
  });

  return ClientProfile;
}; 