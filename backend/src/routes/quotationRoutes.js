const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { auth, authorize } = require('../middleware/auth');

// Allow public access to request a new quotation
router.post('/', quotationController.requestQuotation);

// Admin-only: Get all pending quotations
router.get('/admin/pending', auth, authorize('ADMIN'), quotationController.getAllPendingQuotations);

// PATCH update a quotation by ID (public, for guests and users)
router.patch('/:id', quotationController.updateQuotation);

// All other routes require authentication
router.use(auth);

// Get all quotations for the authenticated user
router.get('/', quotationController.getQuotations);

// Get a specific quotation
router.get('/:id', quotationController.getQuotationById);

// Accept a quotation
router.post('/:id/accept', quotationController.acceptQuotation);

// Reject a quotation
router.post('/:id/reject', quotationController.rejectQuotation);

module.exports = router; 