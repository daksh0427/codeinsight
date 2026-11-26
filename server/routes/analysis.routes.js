import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { analyzeSnippet } from '../controllers/analysis.controller.js';

const router = Router();

router.post('/analyze/:snippetId', authMiddleware, analyzeSnippet);

export default router;
