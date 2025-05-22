const { Booking, User, MaidProfile, ClientProfile } = require('../models');
const { validationResult } = require('express-validator');

exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      maidId,
      startTime,
      endTime,
      duration,
      specialInstructions,
      isRecurring,
      recurringPattern
    } = req.body;

    // Calculate total amount and fees
    const maid = await MaidProfile.findOne({ where: { userId: maidId } });
    const hourlyRate = maid.hourlyRate;
    const totalAmount = (hourlyRate * duration) / 60; // Convert minutes to hours
    const platformFee = totalAmount * 0.15; // 15% platform fee
    const maidEarnings = totalAmount - platformFee;

    const booking = await Booking.create({
      maidId,
      clientId: req.user.id,
      startTime,
      endTime,
      duration,
      totalAmount,
      platformFee,
      maidEarnings,
      specialInstructions,
      isRecurring,
      recurringPattern
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        [req.user.role === 'MAID' ? 'maidId' : 'clientId']: req.user.id
      },
      include: [
        {
          model: User,
          as: req.user.role === 'MAID' ? 'client' : 'maid',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }
      ],
      order: [['startTime', 'DESC']]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        [req.user.role === 'MAID' ? 'maidId' : 'clientId']: req.user.id
      },
      include: [
        {
          model: User,
          as: req.user.role === 'MAID' ? 'client' : 'maid',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        [req.user.role === 'MAID' ? 'maidId' : 'clientId']: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Add validation for status transitions
    const allowedStatuses = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await booking.update({ status });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        [req.user.role === 'MAID' ? 'maidId' : 'clientId']: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.update({
      status: 'CANCELLED',
      cancellationReason,
      cancellationTime: new Date()
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 