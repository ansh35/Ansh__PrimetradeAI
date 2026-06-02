import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, projectId } = req.query;
  
  let filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (projectId) filter.project = projectId;

  let tasks;
  if (req.user.role === 'ADMIN') {
    tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 });
  } else {
    const userProjects = await Project.find({ members: req.user._id }).select('_id');
    const projectIds = userProjects.map(p => p._id);
    
    filter.project = projectId ? projectId : { $in: projectIds };
    
    tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 });
  }

  res.json({
    success: true,
    message: 'Tasks retrieved successfully',
    data: tasks
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('project', 'title members');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role !== 'ADMIN') {
    const isMember = task.project.members.some(
      memberId => memberId.toString() === req.user._id.toString()
    );
    if (!isMember) {
      res.status(403);
      throw new Error('Not authorized to view this task');
    }
  }

  res.json({
    success: true,
    message: 'Task retrieved successfully',
    data: task
  });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo, project } = req.body;

  const projectExists = await Project.findById(project);
  if (!projectExists) {
    res.status(404);
    throw new Error('Project not found');
  }

  const task = new Task({
    title,
    description,
    status: status || 'TODO',
    priority: priority || 'MEDIUM',
    dueDate,
    assignedTo,
    project,
    createdBy: req.user._id,
  });

  const createdTask = await task.save();
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: createdTask
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo } = req.body;

  const task = await Task.findById(req.params.id).populate('project');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role === 'ADMIN') {
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
  } else {
    const isMember = task.project.members.some(
      memberId => memberId.toString() === req.user._id.toString()
    );
    if (isMember) {
      if (status) task.status = status;
    } else {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }
  }

  const updatedTask = await task.save();
  res.json({
    success: true,
    message: 'Task updated successfully',
    data: updatedTask
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('project');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Only ADMIN or the task creator can delete
  if (req.user.role !== 'ADMIN' && task.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await task.deleteOne();
  res.json({
    success: true,
    message: 'Task removed'
  });
});

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
