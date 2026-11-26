import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  uploadSnippet,
  getAllSnippets,
  getSnippet,
  deleteSnippet,
  toggleBookmark,
  getBookmarks,
} from '../controllers/code.controller.js';

const router = Router();

// Bookmarks route must be before :id to avoid conflict
router.get('/bookmarks', authMiddleware, getBookmarks);

router.post(
  '/upload',
  authMiddleware,
  [
    body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required (max 255 chars).'),
    body('language').notEmpty().withMessage('Language is required.'),
    body('raw_code').notEmpty().withMessage('Code is required.'),
  ],
  validate,
  uploadSnippet
);

router.get('/all', authMiddleware, getAllSnippets);
router.get('/:id', authMiddleware, getSnippet);
router.delete('/:id', authMiddleware, deleteSnippet);
router.post('/bookmark/:snippetId', authMiddleware, toggleBookmark);

export default router;
