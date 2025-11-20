import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

// Admin login
router.post('/login', AuthController.login);

export default router;

