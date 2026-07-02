import { sendError } from '../utils/responseFormatter.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRegistration = (req, res, next) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || fullName.trim().length < 3) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Full name must be at least 3 characters');
  }

  if (!email || !validateEmail(email)) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid email format');
  }

  if (!password || !validatePassword(password)) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Password must be at least 8 chars with uppercase, lowercase, number, and special character'
    );
  }

  if (!role || !['admin', 'faculty', 'student'].includes(role)) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid role');
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid email format');
  }

  if (!password || password.length < 1) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Password is required');
  }

  next();
};

export const validateStudentData = (req, res, next) => {
  const { fullName, email, registrationNumber } = req.body;

  if (!fullName || fullName.trim().length < 3) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Full name is required and must be at least 3 characters');
  }

  if (email && !validateEmail(email)) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid email format');
  }

  if (!registrationNumber) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Registration number is required');
  }

  next();
};
