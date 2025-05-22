const { Quotation, User, MaidProfile } = require('../models');
const { Op } = require('sequelize');

// Base rates for different service types (in dollars per hour)
const BASE_RATES = {
  GENERAL_CLEANING: 30,
  DEEP_CLEANING: 45,
  MOVE_IN_OUT: 50,
  POST_CONSTRUCTION: 55,
  WINDOW_CLEANING: 40
};

// Multipliers for different property types
const PROPERTY_MULTIPLIERS = {
  APARTMENT: 1.0,
  HOUSE: 1.2,
  CONDO: 1.1,
  OFFICE: 1.3,
  OTHER: 1.0
};

// Calculate estimated duration in minutes
const calculateDuration = (propertyType, bedrooms, bathrooms, squareFootage) => {
  const baseTime = 120; // 2 hours base time
  const bedroomTime = bedrooms * 30; // 30 minutes per bedroom
  const bathroomTime = bathrooms * 45; // 45 minutes per bathroom
  const squareFootageTime = Math.floor(squareFootage / 500) * 15; // 15 minutes per 500 sq ft

  return baseTime + bedroomTime + bathroomTime + squareFootageTime;
};

// Calculate estimated price
const calculatePrice = (serviceType, propertyType, duration) => {
  const baseRate = BASE_RATES[serviceType];
  const multiplier = PROPERTY_MULTIPLIERS[propertyType];
  const hours = duration / 60;
  
  return (baseRate * multiplier * hours).toFixed(2);
};

exports.requestQuotation = async (req, res) => {
  try {
    const {
      serviceType,
      propertyType,
      bedrooms,
      bathrooms,
      squareFootage,
      specialRequirements,
      isRecurring,
      recurringPattern,
      guestName,
      guestEmail
    } = req.body;

    // Calculate duration and price
    const estimatedDuration = calculateDuration(propertyType, bedrooms, bathrooms, squareFootage);
    const estimatedPrice = calculatePrice(serviceType, propertyType, estimatedDuration);

    // Set quotation validity to 7 days from now
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7);

    // Create quotation
    const quotation = await Quotation.create({
      clientId: req.user ? req.user.id : null,
      guestName: req.user ? req.user.firstName : guestName,
      guestEmail: req.user ? req.user.email : guestEmail,
      serviceType,
      propertyType,
      bedrooms,
      bathrooms,
      squareFootage,
      estimatedDuration,
      estimatedPrice,
      specialRequirements,
      isRecurring,
      recurringPattern,
      validUntil,
      status: 'PENDING'
    });

    res.status(201).json({
      message: 'Quotation request submitted successfully',
      quotation
    });
  } catch (error) {
    console.error('Error creating quotation:', error);
    res.status(500).json({
      error: 'Failed to create quotation request'
    });
  }
};

exports.getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      where: {
        clientId: req.user.id
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({
      error: 'Failed to fetch quotations'
    });
  }
};

exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      where: {
        id: req.params.id,
        clientId: req.user.id
      },
      include: [{
        model: User,
        as: 'maid',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
      }]
    });

    if (!quotation) {
      return res.status(404).json({
        error: 'Quotation not found'
      });
    }

    res.json(quotation);
  } catch (error) {
    console.error('Error fetching quotation:', error);
    res.status(500).json({
      error: 'Failed to fetch quotation'
    });
  }
};

exports.acceptQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      where: {
        id: req.params.id,
        clientId: req.user.id,
        status: 'PENDING'
      }
    });

    if (!quotation) {
      return res.status(404).json({
        error: 'Quotation not found or cannot be accepted'
      });
    }

    // Check if quotation is still valid
    if (new Date() > quotation.validUntil) {
      return res.status(400).json({
        error: 'Quotation has expired'
      });
    }

    await quotation.update({
      status: 'ACCEPTED',
      maidId: req.body.maidId
    });

    res.json({
      message: 'Quotation accepted successfully',
      quotation
    });
  } catch (error) {
    console.error('Error accepting quotation:', error);
    res.status(500).json({
      error: 'Failed to accept quotation'
    });
  }
};

exports.rejectQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      where: {
        id: req.params.id,
        clientId: req.user.id,
        status: 'PENDING'
      }
    });

    if (!quotation) {
      return res.status(404).json({
        error: 'Quotation not found or cannot be rejected'
      });
    }

    await quotation.update({
      status: 'REJECTED'
    });

    res.json({
      message: 'Quotation rejected successfully',
      quotation
    });
  } catch (error) {
    console.error('Error rejecting quotation:', error);
    res.status(500).json({
      error: 'Failed to reject quotation'
    });
  }
};

exports.getAllPendingQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      where: { status: 'PENDING' },
      order: [['createdAt', 'DESC']]
    });
    res.json(quotations);
  } catch (error) {
    console.error('Error fetching pending quotations:', error);
    res.status(500).json({ error: 'Failed to fetch pending quotations' });
  }
}; 