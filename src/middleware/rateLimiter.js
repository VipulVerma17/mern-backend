import { sendError } from '../utils/responseFormatter.js';
import { HTTP_STATUS } from '../config/constants.js';

const requestMap = new Map();

export const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requestMap.has(ip)) {
      requestMap.set(ip, []);
    }

    const requests = requestMap.get(ip);
    const recentRequests = requests.filter((time) => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return sendError(res, HTTP_STATUS.TOO_MANY_REQUESTS || 429, 'Too many requests, please try again later');
    }

    recentRequests.push(now);
    requestMap.set(ip, recentRequests);

    // Cleanup old entries
    if (requestMap.size > 10000) {
      requestMap.clear();
    }

    next();
  };
};

export default rateLimiter;
