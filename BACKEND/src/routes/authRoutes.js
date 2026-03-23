import express from 'express';
const router = express.Router();
import { register, login } from '../controllers/authController.js';

router.post('/register', register);
router.post('/login', login);

import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 // Increased from 10 to 100
});


router.use('/login', loginLimiter);

export default router;
