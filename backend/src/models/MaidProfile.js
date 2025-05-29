'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MaidProfile extends Model {
    static associate(models) {
      // Define associations here
      MaidProfile.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      MaidProfile.hasMany(models.Booking, {
        foreignKey: 'maidId',
        as: 'bookings'
      });
      MaidProfile.hasMany(models.Review, {
        foreignKey: 'maidId',
        as: 'reviews'
      });
      MaidProfile.hasMany(models.Availability, {
        foreignKey: 'maidId',
        as: 'availabilitySlots'
      });
    }

    // Instance methods
    async calculateRating() {
      const reviews = await this.getReviews();
      if (reviews.length === 0) return 0;
      
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return totalRating / reviews.length;
    }

    async isAvailable(date, time) {
      const availabilitySlots = await this.getAvailabilitySlots();
      return availabilitySlots.some(slot => 
        slot.dayOfWeek === date.getDay() &&
        slot.startTime <= time &&
        slot.endTime >= time
      );
    }

    async getUpcomingBookings() {
      const now = new Date();
      return await this.getBookings({
        where: {
          startTime: {
            [sequelize.Op.gt]: now
          }
        },
        order: [['startTime', 'ASC']]
      });
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
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    availability: {
      type: DataTypes.JSON,
      defaultValue: {},
      get() {
        const rawValue = this.getDataValue('availability');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('availability', JSON.stringify(value));
      }
    },
    services: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    serviceAreas: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
  //  isActive: {
  //    type: DataTypes.BOOLEAN,
  //    defaultValue: true
  //  },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    backgroundCheck: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    insuranceInfo: {
      type: DataTypes.JSON,
      defaultValue: {},
      get() {
        const rawValue = this.getDataValue('insuranceInfo');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('insuranceInfo', JSON.stringify(value));
      }
    },
    emergencyContact: {
      type: DataTypes.JSON,
      defaultValue: {},
      get() {
        const rawValue = this.getDataValue('emergencyContact');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('emergencyContact', JSON.stringify(value));
      }
    }
  }, {
    sequelize,
    modelName: 'MaidProfile',
    tableName: 'maidprofiles',
    hooks: {
      beforeSave: async (maidProfile) => {
        if (maidProfile.changed('reviews')) {
          maidProfile.rating = await maidProfile.calculateRating();
        }
      }
    }
  });

  return MaidProfile;
}; 