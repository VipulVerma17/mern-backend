import Course from '../models/Course.js';
import { createCourseRecord, deleteCourseRecord, isDatabaseReady, listCourses, updateCourseRecord } from '../dataStore.js';
import { sendResponse, sendError } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

export const getCourses = async (req, res) => {
  try {
    let courses;
    if (isDatabaseReady()) {
      courses = await Course.find().sort({ createdAt: -1 });
      logger.info('Courses retrieved from database', { count: courses.length, userId: req.user?.id });
    } else {
      courses = listCourses();
      logger.info('Courses retrieved from in-memory store', { count: courses.length, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.OK, courses, 'Courses retrieved successfully');
  } catch (error) {
    logger.error('Get courses error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const createCourse = async (req, res) => {
  try {
    let course;
    if (isDatabaseReady()) {
      course = await Course.create(req.body);
      logger.info('Course created in database', { courseId: course._id, userId: req.user?.id });
    } else {
      course = createCourseRecord(req.body);
      logger.info('Course created in in-memory store', { courseId: course._id, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.CREATED, course, 'Course created successfully');
  } catch (error) {
    logger.error('Create course error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const updateCourse = async (req, res) => {
  try {
    let course;
    if (isDatabaseReady()) {
      course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!course) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Course updated in database', { courseId: course._id, userId: req.user?.id });
    } else {
      course = updateCourseRecord(req.params.id, req.body);
      if (!course) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Course updated in in-memory store', { courseId: course._id, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.OK, course, 'Course updated successfully');
  } catch (error) {
    logger.error('Update course error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const deleteCourse = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Course deleted from database', { courseId: req.params.id, userId: req.user?.id });
    } else {
      const deleted = deleteCourseRecord(req.params.id);
      if (!deleted) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Course deleted from in-memory store', { courseId: req.params.id, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.OK, { id: req.params.id }, 'Course deleted successfully');
  } catch (error) {
    logger.error('Delete course error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};
