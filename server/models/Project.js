import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
