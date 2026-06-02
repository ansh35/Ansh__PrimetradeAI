import express from 'express';
import authRoutes from './authRoutes.js';
import projectRoutes from './projectRoutes.js';
import taskRoutes from './taskRoutes.js';
import teamRoutes from './teamRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/teams', teamRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
