import Student from '../models/Student.js';
import { createStudentRecord, deleteStudentRecord, isDatabaseReady, listStudents, updateStudentRecord } from '../dataStore.js';
import { sendResponse, sendError } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

export const getStudents = async (req, res) => {
  try {
    let students;
    if (isDatabaseReady()) {
      students = await Student.find().sort({ createdAt: -1 });
      logger.info('Students retrieved from database', { count: students.length, userId: req.user?.id });
    } else {
      students = listStudents();
      logger.info('Students retrieved from in-memory store', { count: students.length, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.OK, students, 'Students retrieved successfully');
  } catch (error) {
    logger.error('Get students error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const createStudent = async (req, res) => {
  try {
    let student;
    if (isDatabaseReady()) {
      student = await Student.create(req.body);
      logger.info('Student created in database', { studentId: student._id, userId: req.user?.id });
    } else {
      student = createStudentRecord(req.body);
      logger.info('Student created in in-memory store', { studentId: student._id, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.CREATED, student, 'Student created successfully');
  } catch (error) {
    logger.error('Create student error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const updateStudent = async (req, res) => {
  try {
    let student;
    if (isDatabaseReady()) {
      student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!student) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Student updated in database', { studentId: student._id, userId: req.user?.id });
    } else {
      student = updateStudentRecord(req.params.id, req.body);
      if (!student) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Student updated in in-memory store', { studentId: student._id, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.OK, student, 'Student updated successfully');
  } catch (error) {
    logger.error('Update student error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const deleteStudent = async (req, res) => {
  try {
    if (isDatabaseReady()) {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Student deleted from database', { studentId: req.params.id, userId: req.user?.id });
    } else {
      const deleted = deleteStudentRecord(req.params.id);
      if (!deleted) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      logger.info('Student deleted from in-memory store', { studentId: req.params.id, userId: req.user?.id });
    }
    return sendResponse(res, HTTP_STATUS.OK, { id: req.params.id }, 'Student deleted successfully');
  } catch (error) {
    logger.error('Delete student error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};
