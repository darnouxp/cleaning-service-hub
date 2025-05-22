const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createBooking,
  getBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { body } = require('express-validator');

// Validation middleware
const bookingValidation = [
  body('maidId').isUUID().withMessage('Invalid maid ID'),
  body('startTime').isISO8601().withMessage('Invalid start time'),
  body('endTime').isISO8601().withMessage('Invalid end time'),
  body('duration').isInt({ min: 30 }).withMessage('Duration must be at least 30 minutes'),
  body('isRecurring').isBoolean().withMessage('Invalid recurring flag'),
  body('recurringPattern').optional().isObject().withMessage('Invalid recurring pattern')
];

const statusValidation = [
  body('status').isIn(['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Invalid status')
];

const cancellationValidation = [
  body('cancellationReason').notEmpty().withMessage('Cancellation reason is required')
];

// Routes
router.post('/', auth, bookingValidation, createBooking);
router.get('/', auth, getBookings);
router.get('/:id', auth, getBooking);
router.patch('/:id/status', auth, statusValidation, updateBookingStatus);
router.post('/:id/cancel', auth, cancellationValidation, cancelBooking);

module.exports = router; 