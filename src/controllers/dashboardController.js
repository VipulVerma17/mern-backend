import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Course from '../models/Course.js';
import { isDatabaseReady, listStudents, listFaculty, listCourses } from '../dataStore.js';
import { sendResponse, sendError } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS } from '../config/constants.js';

export const getDashboardStats = async (req, res) => {
  try {
    let stats;

    if (isDatabaseReady()) {
      const [students, faculty, courses] = await Promise.all([
        Student.countDocuments(),
        Faculty.countDocuments(),
        Course.countDocuments()
      ]);

      stats = { students, faculty, courses };
      logger.info('Dashboard stats retrieved from MongoDB', { userId: req.user?.id, ...stats });
    } else {
      stats = {
        students: listStudents().length,
        faculty: listFaculty().length,
        courses: listCourses().length
      };
      logger.info('Dashboard stats retrieved from in-memory store', { userId: req.user?.id, ...stats });
    }

    return sendResponse(res, HTTP_STATUS.OK, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    logger.error('Dashboard stats error', { error: error.message, userId: req.user?.id });
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to fetch dashboard stats');
  }
};
