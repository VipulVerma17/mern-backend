import { HTTP_STATUS } from '../config/constants.js';

export class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
  }
}

export const sendResponse = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    data,
    message,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
};

export default {
  ApiResponse,
  ApiError,
  sendResponse,
  sendError,
};
