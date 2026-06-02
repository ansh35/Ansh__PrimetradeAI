import express from 'express';
import { getTeams, createTeam, addTeamMember, deleteTeam } from '../controllers/teamController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { teamSchema } from '../utils/schemas.js';

const router = express.Router();

router.route('/')
  .get(protect, getTeams)
  .post(protect, admin, validate(teamSchema), createTeam);

router.post('/:id/members', protect, admin, addTeamMember);
router.delete('/:id', protect, admin, deleteTeam);

export default router;
