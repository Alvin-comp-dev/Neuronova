import express from 'express';
import {
  getExperts,
  searchExperts,
  getExpert,
  getMyProfile,
  createOrUpdateProfile,
  addInsight,
  followExpert,
  getTopExpertsByExpertise,
  getExpertStats,
} from '../controllers/expert';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getExperts);
router.get('/search', searchExperts);
router.get('/stats', getExpertStats);
router.get('/top/:expertise', getTopExpertsByExpertise);
router.get('/:id', getExpert);

// Private routes
router.get('/profile/me', auth, getMyProfile);
router.post('/profile', auth, createOrUpdateProfile);
router.post('/insights', auth, addInsight);
router.post('/:id/follow', auth, followExpert);

export default router; 