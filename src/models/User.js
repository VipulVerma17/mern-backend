import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'faculty', 'student'], default: 'student' },
  department: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
