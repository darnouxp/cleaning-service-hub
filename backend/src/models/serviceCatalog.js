'use strict';
module.exports = (sequelize, DataTypes) => {
  const ServiceCatalog = sequelize.define('serviceCatalog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cityCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    priceModel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USD'
    },
    seasonStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    seasonEnd: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tenantID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'serviceCatalog',
    timestamps: true
  });

  return ServiceCatalog;
}; 