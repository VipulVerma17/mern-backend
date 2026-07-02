import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responseFormatter.js';
import { HTTP_STATUS, ERROR_MESSAGES, JWT_CONFIG } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid authorization header', { path: req.path });
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.NO_TOKEN);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_CONFIG.secret);
      req.user = decoded;
      next();
    } catch (error) {
      logger.warn('Token verification failed', { error: error.message });
      
      if (error.name === 'TokenExpiredError') {
        return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Token has expired');
      }
      
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
    }
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message });
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
  }
};

export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.NO_TOKEN);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      logger.warn('Unauthorized role access attempt', { userId: req.user.id, requiredRoles: allowedRoles, userRole: req.user.role });
      return sendError(res, HTTP_STATUS.FORBIDDEN, 'You do not have permission to access this resource');
    }

    next();
  };
};

export default { protect, authorize };
