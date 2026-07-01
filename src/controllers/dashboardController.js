import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Course from '../models/Course.js';
import { isDatabaseReady, listStudents, listFaculty, listCourses } from '../dataStore.js';

export const getDashboardStats = async (_req, res) => {
  try {
    if (isDatabaseReady()) {
      const [students, faculty, courses] = await Promise.all([
        Student.countDocuments(),
        Faculty.countDocuments(),
        Course.countDocuments()
      ]);

      return res.json({ students, faculty, courses });
    }

    return res.json({
      students: listStudents().length,
      faculty: listFaculty().length,
      courses: listCourses().length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
