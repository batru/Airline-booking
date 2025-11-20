import express from 'express';
import BookingController from '../controllers/bookingController.js';

const router = express.Router();

// Create booking draft
router.post('/', BookingController.create);

// Get draft booking by reference
router.get('/drafts/:reference', BookingController.getDraft);

// Get booking by reference
router.get('/:reference', BookingController.getByReference);

// Update booking status
router.put('/:reference/status', BookingController.updateStatus);

// Cancel booking
router.delete('/:reference', BookingController.cancel);

export default router;

