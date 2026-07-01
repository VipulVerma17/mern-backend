import Course from '../models/Course.js';
import { createCourseRecord, deleteCourseRecord, isDatabaseReady, listCourses, updateCourseRecord } from '../dataStore.js';

export const getCourses = async (_req, res) => {
  try {
    if (isDatabaseReady()) {
      const courses = await Course.find().sort({ createdAt: -1 });
      return res.json(courses);
    }
    return res.json(listCourses());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      const course = await Course.create(req.body);
      return res.status(201).json(course);
    }
    return res.status(201).json(createCourseRecord(req.body));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(course);
    }
    return res.json(updateCourseRecord(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      await Course.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Course deleted' });
    }
    deleteCourseRecord(req.params.id);
    return res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
