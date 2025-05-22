'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM type for serviceType
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_quotations_serviceType') THEN
          CREATE TYPE "enum_quotations_serviceType" AS ENUM (
            'GENERAL_CLEANING',
            'DEEP_CLEANING',
            'MOVE_IN_OUT',
            'POST_CONSTRUCTION',
            'WINDOW_CLEANING',
            'POOL_CLEANING',
            'EXTERIOR_CLEANING'
          );
        END IF;
      END$$;
    `);

    await queryInterface.createTable('quotations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      clientId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      maidId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      serviceType: {
        type: Sequelize.ARRAY(Sequelize.ENUM(
          'GENERAL_CLEANING',
          'DEEP_CLEANING',
          'MOVE_IN_OUT',
          'POST_CONSTRUCTION',
          'WINDOW_CLEANING',
          'POOL_CLEANING',
          'EXTERIOR_CLEANING'
        )),
        allowNull: false
      },
      propertyType: {
        type: Sequelize.ENUM(
          'APARTMENT',
          'HOUSE',
          'CONDO',
          'OFFICE',
          'OTHER'
        ),
        allowNull: false
      },
      bedrooms: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      bathrooms: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      squareFootage: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      estimatedDuration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      estimatedPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      specialRequirements: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM(
          'PENDING',
          'ACCEPTED',
          'REJECTED',
          'EXPIRED'
        ),
        defaultValue: 'PENDING'
      },
      validUntil: {
        type: Sequelize.DATE,
        allowNull: false
      },
      isRecurring: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      recurringPattern: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      guestName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      guestEmail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('quotations');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS \"enum_quotations_serviceType\";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS \"enum_quotations_propertyType\";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS \"enum_quotations_status\";');
  }
};