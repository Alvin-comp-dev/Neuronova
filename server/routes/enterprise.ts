import express from 'express';
import {
  createOrganization,
  getOrganizations,
  updateOrganization,
  createTeam,
  getTeams,
  joinTeam
} from '../controllers/enterprise';

const router = express.Router();

// Organization routes
router.post('/organizations', createOrganization);
router.get('/organizations', getOrganizations);
router.put('/organizations/:id', updateOrganization);

// Team routes
router.post('/teams', createTeam);
router.get('/teams', getTeams);
router.post('/teams/:teamId/join', joinTeam);

export default router; 