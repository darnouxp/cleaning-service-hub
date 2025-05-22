const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MaidProfile extends Model {
    static associate(models) {
      // associations can be defined here
      MaidProfile.belongsTo(models.User, { foreignKey: 'userId' });
      MaidProfile.hasMany(models.Booking, { foreignKey: 'maidId' });
      MaidProfile.hasMany(models.Review, { foreignKey: 'maidId' });
    }
  }

  MaidProfile.init({
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
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    availability: {
      type: DataTypes.JSON,
      defaultValue: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: { start: '09:00', end: '17:00' },
        sunday: { start: '09:00', end: '17:00' }
      }
    },
    services: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    languages: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    certifications: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'MaidProfile',
    tableName: 'maidprofiles',
    timestamps: true
  });

  return MaidProfile;
}; 