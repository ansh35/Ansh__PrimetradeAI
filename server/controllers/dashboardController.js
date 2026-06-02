import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  let projectQuery = {};
  let taskQuery = {};

  if (req.user.role !== 'ADMIN') {
    const userProjects = await Project.find({ members: req.user._id }).select('_id');
    const projectIds = userProjects.map(p => p._id);
    projectQuery = { _id: { $in: projectIds } };
    taskQuery = { project: { $in: projectIds } };
  }

  const totalProjects = await Project.countDocuments(projectQuery);
  const totalTasks = await Task.countDocuments(taskQuery);
  const completedTasks = await Task.countDocuments({ ...taskQuery, status: 'DONE' });
  const pendingTasks = await Task.countDocuments({ ...taskQuery, status: { $in: ['TODO', 'IN_PROGRESS'] } });
  
  const now = new Date();
  const overdueTasks = await Task.countDocuments({ 
    ...taskQuery, 
    status: { $ne: 'DONE' },
    dueDate: { $lt: now }
  });

  const recentTasks = await Task.find(taskQuery)
    .populate('project', 'title')
    .sort({ updatedAt: -1 })
    .limit(5);

  const statusSummary = await Task.aggregate([
    { $match: taskQuery },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.json({
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      recentActivity: recentTasks,
      statusSummary: statusSummary.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, { TODO: 0, IN_PROGRESS: 0, DONE: 0 })
    }
  });
});

export { getDashboardStats };
