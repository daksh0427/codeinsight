import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
} from '../controllers/auth.controller.js';

const router = Router();

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3–50 characters.'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  login
);

router.post('/refresh', refresh);

router.post('/logout', authMiddleware, logout);

router.get('/me', authMiddleware, getMe);

router.put(
  '/update',
  authMiddleware,
  [
    body('username').optional().trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3–50 characters.'),
  ],
  validate,
  updateProfile
);

export default router;
