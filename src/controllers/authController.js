import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createUserRecord, findUserByEmail, isDatabaseReady } from '../dataStore.js';
import { sendResponse, sendError } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES, JWT_CONFIG } from '../config/constants.js';

const buildToken = (user) => jwt.sign({ id: user._id, role: user.role }, JWT_CONFIG.secret, { expiresIn: JWT_CONFIG.expiresIn });

const sanitizeUser = (user) => ({ id: user._id, fullName: user.fullName, email: user.email, role: user.role });

const DEMO_CREDENTIALS = {
  email: 'admin@college.com',
  password: 'Admin@123',
  fullName: 'Demo Admin',
  role: 'admin'
};

const isDemoLogin = (email, password) => email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, department, phone } = req.body;

    if (isDatabaseReady()) {
      const existing = await User.findOne({ email });
      if (existing) {
        logger.warn('Registration failed: User already exists', { email });
        return sendError(res, HTTP_STATUS.CONFLICT, ERROR_MESSAGES.USER_EXISTS);
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ fullName, email, password: hash, role, department, phone });
      const token = buildToken(user);
      logger.info('User registered successfully', { userId: user._id, email });
      return sendResponse(res, HTTP_STATUS.CREATED, { token, user: sanitizeUser(user) }, 'Registration successful');
    }

    const existing = findUserByEmail(email);
    if (existing) {
      logger.warn('Registration failed: User already exists', { email });
      return sendError(res, HTTP_STATUS.CONFLICT, ERROR_MESSAGES.USER_EXISTS);
    }

    const hash = await bcrypt.hash(password, 10);
    const user = createUserRecord({ fullName, email, password: hash, role, department, phone, _id: String(Date.now()) });
    const token = buildToken(user);
    logger.info('User registered successfully (in-memory)', { email });
    return sendResponse(res, HTTP_STATUS.CREATED, { token, user: sanitizeUser(user) }, 'Registration successful');
  } catch (error) {
    logger.error('Registration error', { error: error.message, email: req.body.email });
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Demo login
    if (isDemoLogin(email, password)) {
      const demoUser = {
        _id: 'demo-admin',
        fullName: DEMO_CREDENTIALS.fullName,
        email: DEMO_CREDENTIALS.email,
        role: DEMO_CREDENTIALS.role
      };
      const token = buildToken(demoUser);
      logger.info('Demo user login successful', { email });
      return sendResponse(res, HTTP_STATUS.OK, { token, user: sanitizeUser(demoUser) }, 'Login successful');
    }

    // Database login
    if (isDatabaseReady()) {
      const user = await User.findOne({ email });
      if (!user) {
        logger.warn('Login failed: User not found', { email });
        return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        logger.warn('Login failed: Invalid password', { email });
        return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const token = buildToken(user);
      logger.info('User login successful', { userId: user._id, email });
      return sendResponse(res, HTTP_STATUS.OK, { token, user: sanitizeUser(user) }, 'Login successful');
    }

    // In-memory fallback
    const user = findUserByEmail(email);
    if (!user) {
      logger.warn('Login failed: User not found (in-memory)', { email });
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      logger.warn('Login failed: Invalid password (in-memory)', { email });
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = buildToken(user);
    logger.info('User login successful (in-memory)', { email });
    return sendResponse(res, HTTP_STATUS.OK, { token, user: sanitizeUser(user) }, 'Login successful');
  } catch (error) {
    logger.error('Login error', { error: error.message, email: req.body.email });
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  }
};
