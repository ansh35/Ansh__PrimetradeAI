import Team from '../models/Team.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
export const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({
    $or: [
      { createdBy: req.user._id },
      { members: req.user._id }
    ]
  }).populate('members', 'name email role').populate('createdBy', 'name email');
  
  res.json({
    success: true,
    message: 'Teams retrieved successfully',
    data: teams
  });
});

export const createTeam = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const team = await Team.create({
    name,
    description,
    createdBy: req.user._id,
    members: [req.user._id]
  });

  res.status(201).json({
    success: true,
    message: 'Team created successfully',
    data: team
  });
});

export const addTeamMember = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  const userToAdd = await User.findOne({ email });
  if (!userToAdd) {
    res.status(404);
    throw new Error('User not found with this email');
  }

  if (team.members.includes(userToAdd._id)) {
    res.status(400);
    throw new Error('User is already a member of this team');
  }

  team.members.push(userToAdd._id);
  await team.save();

  res.json({
    success: true,
    message: 'Member added successfully',
    data: team
  });
});

export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  await team.deleteOne();
  res.json({
    success: true,
    message: 'Team removed'
  });
});
