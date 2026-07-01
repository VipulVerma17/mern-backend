import Student from '../models/Student.js';
import { createStudentRecord, deleteStudentRecord, isDatabaseReady, listStudents, updateStudentRecord } from '../dataStore.js';

export const getStudents = async (_req, res) => {
  try {
    if (isDatabaseReady()) {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.json(students);
    }
    return res.json(listStudents());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      const student = await Student.create(req.body);
      return res.status(201).json(student);
    }
    return res.status(201).json(createStudentRecord(req.body));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(student);
    }
    return res.json(updateStudentRecord(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      await Student.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Student deleted' });
    }
    deleteStudentRecord(req.params.id);
    return res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
