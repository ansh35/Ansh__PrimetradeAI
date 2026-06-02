import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;
