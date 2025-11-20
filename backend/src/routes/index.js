import express from 'express';
import bookingRoutes from './bookingRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

// API v1 routes
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Airline Booking API v1',
    version: '1.0.0',
  endpoints: {
    bookings: '/api/v1/bookings',
    payments: '/api/v1/payments',
    admin: '/api/v1/admin',
    auth: '/api/v1/auth'
  }
  });
});

export default router;

