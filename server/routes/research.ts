import express from 'express';
import {
  getResearch,
  searchResearch,
  getTrendingResearch,
  getResearchById,
  getResearchCategories,
  getResearchStats,
  bookmarkResearch,
  createResearch,
} from '../controllers/research';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getResearch);
router.get('/search', searchResearch);
router.get('/trending', getTrendingResearch);
router.get('/categories', getResearchCategories);
router.get('/stats', getResearchStats);
router.get('/:id', getResearchById);

// Protected routes
router.post('/:id/bookmark', protect, bookmarkResearch);

// Admin only routes
router.post('/', protect, authorize('admin'), createResearch);

export default router; 