import Faculty from '../models/Faculty.js';
import { createFacultyRecord, deleteFacultyRecord, isDatabaseReady, listFaculty, updateFacultyRecord } from '../dataStore.js';

export const getFaculty = async (_req, res) => {
  try {
    if (isDatabaseReady()) {
      const faculty = await Faculty.find().sort({ createdAt: -1 });
      return res.json(faculty);
    }
    return res.json(listFaculty());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFaculty = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      const faculty = await Faculty.create(req.body);
      return res.status(201).json(faculty);
    }
    return res.status(201).json(createFacultyRecord(req.body));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(faculty);
    }
    return res.json(updateFacultyRecord(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      await Faculty.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Faculty deleted' });
    }
    deleteFacultyRecord(req.params.id);
    return res.json({ message: 'Faculty deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
