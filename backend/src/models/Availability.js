'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    static associate(models) {
      Availability.belongsTo(models.MaidProfile, {
        foreignKey: 'maidId',
        as: 'maid'
      });
    }

    // Instance methods
    isOverlapping(otherAvailability) {
      return (
        this.dayOfWeek === otherAvailability.dayOfWeek &&
        (
          (this.startTime <= otherAvailability.startTime && this.endTime > otherAvailability.startTime) ||
          (this.startTime < otherAvailability.endTime && this.endTime >= otherAvailability.endTime) ||
          (this.startTime >= otherAvailability.startTime && this.endTime <= otherAvailability.endTime)
        )
      );
    }

    static async findAvailableSlots(maidId, date) {
      const dayOfWeek = date.getDay();
      return await this.findAll({
        where: {
          maidId,
          dayOfWeek,
          isRecurring: true
        }
      });
    }
  }

  Availability.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    maidId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'maidprofiles',
        key: 'id'
      }
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 6
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    specificDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Availability',
    tableName: 'availabilities',
    indexes: [
      {
        fields: ['maidId', 'dayOfWeek']
      },
      {
        fields: ['maidId', 'specificDate']
      }
    ],
    validate: {
      endTimeAfterStartTime() {
        if (this.startTime >= this.endTime) {
          throw new Error('End time must be after start time');
        }
      },
      specificDateRequiredForNonRecurring() {
        if (!this.isRecurring && !this.specificDate) {
          throw new Error('Specific date is required for non-recurring availability');
        }
      }
    }
  });

  return Availability;
}; 