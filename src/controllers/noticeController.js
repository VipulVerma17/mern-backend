import { createNoticeRecord, deleteNoticeRecord, listNotices, updateNoticeRecord } from '../dataStore.js';
import { sendResponse, sendError } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

export const getNotices = async (req, res) => {
  try {
    const notices = listNotices();
    logger.info('Notices retrieved', { count: notices.length, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.OK, notices, 'Notices retrieved successfully');
  } catch (error) {
    logger.error('Get notices error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const createNotice = async (req, res) => {
  try {
    const record = createNoticeRecord(req.body);
    logger.info('Notice created', { noticeId: record._id, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.CREATED, record, 'Notice created successfully');
  } catch (error) {
    logger.error('Create notice error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const updateNotice = async (req, res) => {
  try {
    const record = updateNoticeRecord(req.params.id, req.body);
    if (!record) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    logger.info('Notice updated', { noticeId: record._id, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.OK, record, 'Notice updated successfully');
  } catch (error) {
    logger.error('Update notice error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const deleted = deleteNoticeRecord(req.params.id);
    if (!deleted) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    logger.info('Notice deleted', { noticeId: req.params.id, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.OK, { id: req.params.id }, 'Notice deleted successfully');
  } catch (error) {
    logger.error('Delete notice error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};
