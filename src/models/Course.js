import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  credits: { type: Number, required: true },
  semester: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);
