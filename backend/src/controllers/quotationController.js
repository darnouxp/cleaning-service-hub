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

// Helper function to get average square footage from range
const getAverageSquareFootage = (squareFootageRange) => {
  if (!squareFootageRange) return 1000; // default value
  
  // Handle special case for "3000+"
  if (squareFootageRange === '3000+') return 3500;
  
  // Handle ranges like "500-999"
  const [min, max] = squareFootageRange.split('-').map(num => parseInt(num.trim()));
  if (isNaN(min) || isNaN(max)) return 1000; // default value if parsing fails
  
  return Math.floor((min + max) / 2);
};

// Calculate estimated duration in minutes
const calculateDuration = (propertyType, bedrooms, bathrooms, squareFootage) => {
  const baseTime = 120; // 2 hours base time
  const bedroomTime = (bedrooms || 1) * 30; // 30 minutes per bedroom
  const bathroomTime = (bathrooms || 1) * 45; // 45 minutes per bathroom
  
  // Get average square footage from range
  const avgSquareFootage = getAverageSquareFootage(squareFootage);
  const squareFootageTime = Math.floor(avgSquareFootage / 500) * 15; // 15 minutes per 500 sq ft

  return baseTime + bedroomTime + bathroomTime + squareFootageTime;
};

// Calculate estimated price
const calculatePrice = (serviceType, propertyType, duration) => {
  if (!serviceType || !propertyType || !duration) return null;
  
  const baseRate = BASE_RATES[serviceType] || BASE_RATES.GENERAL_CLEANING;
  const multiplier = PROPERTY_MULTIPLIERS[propertyType] || 1.0;
  const hours = duration / 60;
  
  return (baseRate * multiplier * hours).toFixed(2);
};

exports.requestQuotation = async (req, res) => {
  try {
    const {
      serviceCatalogIds,
      serviceType,
      propertyType,
      bedrooms,
      bathrooms,
      squareFootage,
      specialRequirements,
      guestName,
      guestEmail,
      price,
      frequency,
      preferredDate,
      preferredTime,
      specialInstructions,
      customerPhone,
      customerEmail,
      customerName,
      zipcode
    } = req.body;

    let phone = customerPhone;
    let email = customerEmail;
    const contactInfo = phone || email;
    const isEmail = contactInfo && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactInfo);
    const isPhone = contactInfo && /^\+?\d{7,}$/.test(contactInfo.replace(/\D/g, ''));
    if (isEmail) {
      email = contactInfo;
      phone = null;
    } else if (isPhone) {
      phone = contactInfo;
      email = null;
    } else {
      phone = null;
      email = null;
    }

    // Create quotation
    const quotation = await Quotation.create({
      customerId: req.user ? req.user.id : null,
      customerName,
      customerPhone: phone,
      customerEmail: email,
      zipcode,
      serviceCatalogIds,
      serviceType,
      propertyType,
      bedrooms: bedrooms || 1,
      bathrooms: bathrooms || 1,
      squareFootage,
      specialRequirements,
      status: 'PENDING',
      price,
      frequency,
      preferredDate,
      preferredTime,
      specialInstructions
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
        customerId: req.user.id
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
        customerId: req.user.id
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
        customerId: req.user.id,
        status: 'PENDING'
      }
    });

    if (!quotation) {
      return res.status(404).json({
        error: 'Quotation not found or cannot be accepted'
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
        customerId: req.user.id,
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

exports.createQuotation = async (req, res) => {
  try {
    const {
      serviceCatalogIds,
      serviceType,
      propertyType,
      bedrooms,
      bathrooms,
      squareFootage,
      specialRequirements,
      guestName,
      guestEmail,
      price,
      frequency,
      preferredDate,
      preferredTime,
      specialInstructions,
      customerPhone
    } = req.body;

    // Validate and format the date
    let formattedDate = null;
    if (preferredDate && preferredDate !== 'Invalid date') {
      try {
        const date = new Date(preferredDate);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString();
        }
      } catch (error) {
        console.error('Invalid date format:', error);
      }
    }

    const quotationData = {
      serviceCatalogIds,
      serviceType,
      propertyType,
      bedrooms: bedrooms || 1,
      bathrooms: bathrooms || 1,
      squareFootage,
      specialRequirements,
      status: 'PENDING',
      customerName: req.user ? req.user.firstName : guestName,
      customerEmail: req.user ? req.user.email : guestEmail,
      price,
      frequency,
      preferredTime,
      specialInstructions,
      customerPhone,
      customerId: req.user ? req.user.id : null
    };

    // Only add preferredDate if it's valid
    if (formattedDate) {
      quotationData.preferredDate = formattedDate;
    }

    const quotation = await Quotation.create(quotationData);

    res.status(201).json({ quotation });
  } catch (error) {
    console.error('Error creating quotation:', error);
    res.status(500).json({ error: 'Error creating quotation' });
  }
};

exports.updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    // Find the quotation by ID
    const quotation = await Quotation.findByPk(id);
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    // Handle preferredDate: set to null if 'Invalid date', or format as ISO string if valid
    if (updateFields.preferredDate === 'Invalid date') {
      updateFields.preferredDate = null;
    } else if (updateFields.preferredDate) {
      try {
        const date = new Date(updateFields.preferredDate);
        if (!isNaN(date.getTime())) {
          updateFields.preferredDate = date.toISOString();
        } else {
          updateFields.preferredDate = null;
        }
      } catch (error) {
        updateFields.preferredDate = null;
      }
    }
    // Update only provided fields
    await quotation.update(updateFields);
    res.json({ message: 'Quotation updated', quotation });
  } catch (error) {
    console.error('Error updating quotation:', error);
    res.status(500).json({ error: 'Failed to update quotation' });
  }
}; 