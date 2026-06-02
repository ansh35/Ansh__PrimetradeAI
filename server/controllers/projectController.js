import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Team from '../models/Team.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  let projects;
  if (req.user.role === 'ADMIN') {
    projects = await Project.find({}).populate('createdBy', 'name email').populate('members', 'name email role').populate({
      path: 'team',
      populate: { path: 'members', select: 'name email role' }
    });
  } else {
    const userTeams = await Team.find({ members: req.user._id });
    const teamIds = userTeams.map(t => t._id);

    projects = await Project.find({
      $or: [
        { members: req.user._id },
        { team: { $in: teamIds } }
      ]
    }).populate('createdBy', 'name email').populate('members', 'name email role').populate({
      path: 'team',
      populate: { path: 'members', select: 'name email role' }
    });
  }
  res.json({
    success: true,
    message: 'Projects retrieved successfully',
    data: projects
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('createdBy', 'name email').populate('members', 'name email role');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const isMember = project.members.some(member => member._id.toString() === req.user._id.toString());
  
  let isTeamMember = false;
  if (project.team) {
    const team = await Team.findById(project.team);
    if (team && team.members.some(m => m.toString() === req.user._id.toString())) {
      isTeamMember = true;
    }
  }

  if (req.user.role !== 'ADMIN' && !isMember && !isTeamMember) {
    res.status(403);
    throw new Error('Not authorized to view this project');
  }

  res.json({
    success: true,
    message: 'Project retrieved successfully',
    data: project
  });
});

const createProject = asyncHandler(async (req, res) => {
  const { title, description, members, team } = req.body;

  const project = new Project({
    title,
    description,
    team: team || undefined,
    createdBy: req.user._id,
    members: members || [req.user._id],
  });

  const createdProject = await project.save();
  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: createdProject
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const { title, description, members, team } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.title = title || project.title;
    project.description = description || project.description;
    if (members !== undefined) project.members = members;
    if (team !== undefined) project.team = team || undefined;

    const updatedProject = await project.save();
    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    res.json({
      success: true,
      message: 'Project removed'
    });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

const addMember = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User to add not found');
  }

  if (project.members.includes(user._id)) {
    res.status(400);
    throw new Error('User is already a member');
  }

  project.members.push(user._id);
  await project.save();

  res.status(200).json({
    success: true,
    message: 'Member added to project',
    data: project
  });
});

const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  project.members = project.members.filter(
    (memberId) => memberId.toString() !== req.params.memberId
  );

  await project.save();
  res.status(200).json({
    success: true,
    message: 'Member removed from project',
    data: project
  });
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
