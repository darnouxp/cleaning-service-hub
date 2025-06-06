'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('serviceCatalog', [
      // Main services
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'General Cleaning',
        type: 'main',
        icon: 'CleaningServices',
        description: null,
        priceModel: 'per_hour',
        unit: 'hour',
        rate: 27.5,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Deep Cleaning',
        type: 'main',
        icon: 'LocalCarWash',
        description: null,
        priceModel: 'per_hour',
        unit: 'hour',
        rate: 38.5,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Post-Construction Cleaning',
        type: 'main',
        icon: 'Build',
        description: null,
        priceModel: 'per_sqft',
        unit: 'sqft',
        rate: 0.55,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Move In/Move Out Cleaning',
        type: 'main',
        icon: 'MeetingRoom',
        description: null,
        priceModel: 'flat',
        unit: 'service',
        rate: 225.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Office/Commercial Cleaning',
        type: 'main',
        icon: 'Apartment',
        description: null,
        priceModel: 'per_hour',
        unit: 'hour',
        rate: 45.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Pool Cleaning',
        type: 'main',
        icon: 'Pool',
        description: null,
        priceModel: 'per_visit',
        unit: 'visit',
        rate: 85.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Exteriors Cleaning',
        type: 'main',
        icon: 'HomeWork',
        description: null,
        priceModel: 'per_sqft',
        unit: 'sqft',
        rate: 0.35,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      // Extra services
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Inside the Fridge',
        type: 'extra',
        icon: 'Kitchen',
        description: null,
        priceModel: 'flat',
        unit: 'service',
        rate: 32.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Inside the Oven',
        type: 'extra',
        icon: 'Microwave',
        description: null,
        priceModel: 'flat',
        unit: 'service',
        rate: 28.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Inside Windows (30 min)',
        type: 'extra',
        icon: 'Window',
        description: null,
        priceModel: 'per_unit',
        unit: '30min',
        rate: 30.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Load of Laundry (max 2 loads)',
        type: 'extra',
        icon: 'LocalLaundryService',
        description: null,
        priceModel: 'per_load',
        unit: 'load',
        rate: 16.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Inside Cabinets',
        type: 'extra',
        icon: 'Kitchen',
        description: null,
        priceModel: 'flat',
        unit: 'service',
        rate: 38.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Wet Wipe Baseboards',
        type: 'extra',
        icon: 'BorderBottom',
        description: null,
        priceModel: 'per_room',
        unit: 'room',
        rate: 16.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Ceiling Fans (per fan)',
        type: 'extra',
        icon: 'ToysFan',
        description: null,
        priceModel: 'per_unit',
        unit: 'fan',
        rate: 12.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Wet Wipe Blinds (per blind)',
        type: 'extra',
        icon: 'Blinds',
        description: null,
        priceModel: 'per_unit',
        unit: 'blind',
        rate: 8.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Wall Cleaning (per sqft)',
        type: 'extra',
        icon: 'FormatPaint',
        description: null,
        priceModel: 'per_sqft',
        unit: 'sqft',
        rate: 0.10,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        cityCode: 'NYC',
        name: 'Home Organization (per hour)',
        type: 'extra',
        icon: 'AccessTime',
        description: null,
        priceModel: 'per_hour',
        unit: 'hour',
        rate: 35.0,
        currency: 'USD',
        seasonStart: new Date('2025-01-01'),
        seasonEnd: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(), tenantID:1
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('serviceCatalog', null, {});
  }
}; 