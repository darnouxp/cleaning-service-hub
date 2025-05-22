'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('maidprofiles', 'certifications', {
      type: Sequelize.JSON,
      defaultValue: []
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('maidprofiles', 'certifications');
  }
}; 