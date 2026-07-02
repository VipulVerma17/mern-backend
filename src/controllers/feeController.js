import { createFeeRecord, deleteFeeRecord, isDatabaseReady, listFees, updateFeeRecord } from '../dataStore.js';
import { sendResponse, sendError } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

export const getFees = async (req, res) => {
  try {
    const fees = listFees();
    logger.info('Fee records retrieved', { count: fees.length, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.OK, fees, 'Fee records retrieved successfully');
  } catch (error) {
    logger.error('Get fees error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const createFee = async (req, res) => {
  try {
    const record = createFeeRecord(req.body);
    logger.info('Fee record created', { recordId: record._id, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.CREATED, record, 'Fee record created successfully');
  } catch (error) {
    logger.error('Create fee error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const updateFee = async (req, res) => {
  try {
    const record = updateFeeRecord(req.params.id, req.body);
    if (!record) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    logger.info('Fee record updated', { recordId: record._id, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.OK, record, 'Fee record updated successfully');
  } catch (error) {
    logger.error('Update fee error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const deleteFee = async (req, res) => {
  try {
    const deleted = deleteFeeRecord(req.params.id);
    if (!deleted) return sendError(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    logger.info('Fee record deleted', { recordId: req.params.id, userId: req.user?.id });
    return sendResponse(res, HTTP_STATUS.OK, { id: req.params.id }, 'Fee record deleted successfully');
  } catch (error) {
    logger.error('Delete fee error', { error: error.message });
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};
