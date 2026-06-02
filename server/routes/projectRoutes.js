import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { projectSchema } from '../utils/schemas.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects (admin sees all; members see their own)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Create a new project (Admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *                 example: TaskFlow MVP
 *               description:
 *                 type: string
 *                 example: Main product development project
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["664abc123def456ghi789"]
 *               team:
 *                 type: string
 *                 example: "664abc123def456ghi001"
 *     responses:
 *       201:
 *         description: Project created successfully
 *       403:
 *         description: Admin access required
 */
router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, validate(projectSchema), createProject);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 *   put:
 *     summary: Update a project (Admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *               team:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Project not found
 *   delete:
 *     summary: Delete a project (Admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project removed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Project not found
 */
router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, admin, validate(projectSchema), updateProject)
  .delete(protect, admin, deleteProject);

/**
 * @swagger
 * /projects/{id}/members:
 *   post:
 *     summary: Add a member to a project by email (Admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: member@example.com
 *     responses:
 *       200:
 *         description: Member added to project
 *       400:
 *         description: User is already a member
 *       404:
 *         description: Project or user not found
 */
router.route('/:id/members')
  .post(protect, admin, addMember);

/**
 * @swagger
 * /projects/{id}/members/{memberId}:
 *   delete:
 *     summary: Remove a member from a project (Admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed from project
 *       404:
 *         description: Project not found
 */
router.route('/:id/members/:memberId')
  .delete(protect, admin, removeMember);

export default router;
