import { createAttendanceRecord, deleteAttendanceRecord, isDatabaseReady, listAttendance, updateAttendanceRecord } from '../dataStore.js';
import { sendResponse, sendError } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

export const getAttendance = async (req, res) => {
  try {
    const attendance = listAttendance();
    logger.info('Attendance records retrieved', { count: attendance.length, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.OK, attendance, 'Attendance records retrieved successfully');
  } catch (error) {
    logger.error('Get attendance error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const createAttendance = async (req, res) => {
  try {
    const record = createAttendanceRecord(req.body);
    logger.info('Attendance record created', { recordId: record._id, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.CREATED, record, 'Attendance record created successfully');
  } catch (error) {
    logger.error('Create attendance error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const record = updateAttendanceRecord(req.params.id, req.body);
    if (!record) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    logger.info('Attendance record updated', { recordId: record._id, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.OK, record, 'Attendance record updated successfully');
  } catch (error) {
    logger.error('Update attendance error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const deleted = deleteAttendanceRecord(req.params.id);
    if (!deleted) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    logger.info('Attendance record deleted', { recordId: req.params.id, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.OK, { id: req.params.id }, 'Attendance record deleted successfully');
  } catch (error) {
    logger.error('Delete attendance error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};
