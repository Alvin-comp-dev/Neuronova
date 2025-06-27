import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Placeholder routes - to be implemented in Phase 2
router.get('/profile', protect, (req, res) => {
  res.json({ success: true, message: 'User profile endpoint' });
});

router.put('/profile', protect, (req, res) => {
  res.json({ success: true, message: 'Update user profile endpoint' });
});

export default router; 