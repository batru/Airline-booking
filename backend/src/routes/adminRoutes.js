import express from 'express';
import AdminController from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticateAdmin);

// Get all bookings with filters
router.get('/bookings', AdminController.getAllBookings);

// Get booking by ID
router.get('/bookings/:id', AdminController.getBookingById);

// Update booking status
router.put('/bookings/:id/status', AdminController.updateBookingStatus);

// Get analytics
router.get('/analytics', AdminController.getAnalytics);

// Get dashboard stats
router.get('/stats', AdminController.getDashboardStats);

export default router;

