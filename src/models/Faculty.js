import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Faculty', facultySchema);
