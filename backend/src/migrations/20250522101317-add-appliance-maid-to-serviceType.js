'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new values to the ENUM type for serviceType
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_quotations_serviceType"
      ADD VALUE IF NOT EXISTS 'APPLIANCE_CLEANING';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_quotations_serviceType"
      ADD VALUE IF NOT EXISTS 'MAID_SERVICE';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Postgres does not support removing ENUM values easily.
    // You can leave this empty or document that down migration is not supported for ENUM value removal.
  }
};