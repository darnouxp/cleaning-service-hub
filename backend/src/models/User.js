const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
      User.hasOne(models.MaidProfile, { foreignKey: 'userId', as: 'maidProfile' });
      User.hasOne(models.ClientProfile, { foreignKey: 'userId', as: 'clientProfile' });
      User.hasMany(models.Booking, { foreignKey: 'maidId', as: 'maidBookings' });
      User.hasMany(models.Booking, { foreignKey: 'clientId', as: 'clientBookings' });
      User.hasMany(models.Review, { foreignKey: 'maidId', as: 'maidReviews' });
      User.hasMany(models.Review, { foreignKey: 'clientId', as: 'clientReviews' });
    }

    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    async hasPermission(permission) {
      const role = await this.getRole();
      return role?.permissions?.[permission] === true;
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  return User;
}; 