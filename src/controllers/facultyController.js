import Faculty from '../models/Faculty.js';
import { createFacultyRecord, deleteFacultyRecord, isDatabaseReady, listFaculty, updateFacultyRecord } from '../dataStore.js';
import { sendResponse, sendError } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

export const getFaculty = async (req, res) => {
  try {
    let faculty;
    if (isDatabaseReady()) {
      faculty = await Faculty.find().sort({ createdAt: -1 });
      logger.info('Faculty retrieved from database', { count: faculty.length, userId: req.user?.id });
    } else {
      faculty = listFaculty();
      logger.info('Faculty retrieved from in-memory store', { count: faculty.length, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.OK, faculty, 'Faculty retrieved successfully');
  } catch (error) {
    logger.error('Get faculty error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const createFaculty = async (req, res) => {
  try {
    let faculty;
    if (isDatabaseReady()) {
      faculty = await Faculty.create(req.body);
      logger.info('Faculty created in database', { facultyId: faculty._id, userId: req.user?.id });
    } else {
      faculty = createFacultyRecord(req.body);
      logger.info('Faculty created in in-memory store', { facultyId: faculty._id, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.CREATED, faculty, 'Faculty created successfully');
  } catch (error) {
    logger.error('Create faculty error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    let faculty;
    if (isDatabaseReady()) {
      faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!faculty) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Faculty updated in database', { facultyId: faculty._id, userId: req.user?.id });
    } else {
      faculty = updateFacultyRecord(req.params.id, req.body);
      if (!faculty) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Faculty updated in in-memory store', { facultyId: faculty._id, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.OK, faculty, 'Faculty updated successfully');
  } catch (error) {
    logger.error('Update faculty error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      const faculty = await Faculty.findByIdAndDelete(req.params.id);
      if (!faculty) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Faculty deleted from database', { facultyId: req.params.id, userId: req.user?.id });
    } else {
      const deleted = deleteFacultyRecord(req.params.id);
      if (!deleted) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Faculty deleted from in-memory store', { facultyId: req.params.id, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.OK, { id: req.params.id }, 'Faculty deleted successfully');
  } catch (error) {
    logger.error('Delete faculty error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};
