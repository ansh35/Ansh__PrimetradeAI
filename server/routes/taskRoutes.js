import express from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { taskSchema, updateTaskSchema } from '../utils/schemas.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management (CRUD)
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks (admin sees all; members see their project tasks)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE]
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         description: Filter by priority
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by project ID
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       403:
 *         description: Not authorized to view this task
 *       404:
 *         description: Task not found
 */
router.get('/:id', protect, getTaskById);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task (Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, project]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Implement login page
 *               description:
 *                 type: string
 *                 example: Build the login UI with form validation
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-30"
 *               project:
 *                 type: string
 *                 example: "664abc123def456ghi789"
 *               assignedTo:
 *                 type: string
 *                 example: "664abc123def456ghi000"
 *     responses:
 *       201:
 *         description: Task created successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Project not found
 */
router.post('/', protect, admin, validate(taskSchema), createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task (Admin can update all fields; members can only update status)
 *     tags: [Tasks]
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Task not found
 */
router.put('/:id', protect, validate(updateTaskSchema), updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task (Admin or task creator only)
 *     tags: [Tasks]
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
 *         description: Task removed
 *       403:
 *         description: Not authorized to delete this task
 *       404:
 *         description: Task not found
 */
router.delete('/:id', protect, deleteTask);

export default router;
