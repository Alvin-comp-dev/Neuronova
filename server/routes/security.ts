import express from 'express';
import {
  getSecurityEvents,
  performSecurityScan,
  getSecurityConfig,
  updateSecurityConfig,
  gdprDataExport
} from '../controllers/security';

const router = express.Router();

// Security monitoring routes
router.get('/events', getSecurityEvents);
router.post('/scan', performSecurityScan);

// Security configuration routes
router.get('/config', getSecurityConfig);
router.put('/config', updateSecurityConfig);

// Compliance routes
router.get('/gdpr/export/:userId', gdprDataExport);

export default router; 