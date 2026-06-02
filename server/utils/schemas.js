import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'MEMBER']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Project title must be at least 2 characters'),
  description: z.string().min(1, 'Description is required'),
  members: z.array(z.string()).optional(),
  team: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().optional(),
  project: z.string(),
  assignedTo: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters').optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
});

export const teamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  description: z.string().min(1, 'Description is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});
