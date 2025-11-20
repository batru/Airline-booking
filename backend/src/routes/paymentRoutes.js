import express from 'express';
import PaymentController from '../controllers/paymentController.js';

const router = express.Router();

// Middleware to capture raw body for webhook signature verification
router.use('/webhooks/paystack', express.raw({ type: 'application/json' }));

// Get Paystack public key
router.get('/public-key', PaymentController.getPublicKey);

// Initialize payment
router.post('/initialize', PaymentController.initialize);

// Verify payment by reference
router.get('/verify/:paymentReference', PaymentController.verify);

// Paystack webhook
router.post('/webhooks/paystack', PaymentController.webhook);

export default router;

