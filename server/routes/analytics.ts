import express from 'express';
import { auth } from '../middleware/auth';
import * as analyticsController from '../controllers/analytics';

const router = express.Router();

// Track analytics event (public endpoint for tracking)
router.post('/track', analyticsController.trackEvent);

// Get real-time statistics (requires auth)
router.get('/realtime', auth, analyticsController.getRealTimeStats);

// Get page view analytics
router.get('/pageviews', auth, analyticsController.getPageViews);

// Get user engagement analytics
router.get('/engagement', auth, analyticsController.getUserEngagement);

// Get top pages
router.get('/pages/top', auth, analyticsController.getTopPages);

// Get device statistics
router.get('/devices', auth, analyticsController.getDeviceStats);

// Get conversion funnel
router.get('/funnel', auth, analyticsController.getConversionFunnel);

// Get comprehensive dashboard data
router.get('/dashboard', auth, analyticsController.getDashboardData);

export default router; 