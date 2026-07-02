import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { setDatabaseReady } from './dataStore.js';
import { logger } from './utils/logger.js';
import { sendResponse, sendError } from './utils/responseFormatter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import rateLimiter from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import { HTTP_STATUS, RATE_LIMIT_CONFIG } from './config/constants.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDistDirPath = path.join(rootDir, 'client', 'dist');
const clientDistIndexPath = path.join(clientDistDirPath, 'index.html');
const clientIndexPath = path.join(rootDir, 'client', 'index.html');
const frontendIndexPath = fs.existsSync(clientDistIndexPath)
  ? clientDistIndexPath
  : fs.existsSync(clientIndexPath)
    ? clientIndexPath
    : null;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging and rate limiting
app.use(requestLogger);
app.use(rateLimiter(RATE_LIMIT_CONFIG.windowMs, RATE_LIMIT_CONFIG.maxRequests));

// Static files
if (fs.existsSync(clientDistDirPath)) {
  app.use(express.static(clientDistDirPath));
}

const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  sendResponse(res, HTTP_STATUS.OK, { status: 'healthy' }, 'College Management API is running');
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/students', studentRoutes);
apiRouter.use('/faculty', facultyRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/fees', feeRoutes);
apiRouter.use('/notices', noticeRoutes);

app.use((req, _res, next) => {
  if (req.path.startsWith('/api/index')) {
    req.url = req.url.replace(/^\/api\/index/, '');
  }
  next();
});

app.use('/api', apiRouter);

app.get(['/', '/:path(*)'], (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  if (req.path.includes('.')) {
    return next();
  }

  if (!frontendIndexPath) {
    return res.status(404).json({ error: 'Frontend not built yet' });
  }

  return res.sendFile(frontendIndexPath);
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = (port) => {
  const server = app.listen(port, () => {
    logger.info(`Server started successfully on port ${port}`, { port, environment: process.env.NODE_ENV });
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.warn(`Port ${port} is busy. Trying ${port + 1}...`, { port });
      startServer(port + 1);
    } else {
      logger.error('Server error', { error: error.message, code: error.code });
      process.exit(1);
    }
  });
};

const connectMongoDB = async () => {
  const atlasUri = process.env.MONGO_URI;
  const localUri = 'mongodb://127.0.0.1:27017/college-management';
  const dbName = process.env.MONGO_DB_NAME || 'college-management';

  mongoose.connection.on('connected', () => {
    setDatabaseReady(true);
    logger.info('MongoDB connected successfully', { dbName });
  });

  mongoose.connection.on('disconnected', () => {
    setDatabaseReady(false);
    logger.warn('MongoDB disconnected, continuing with in-memory fallback');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', { error: err.message });
  });

  const formatConnectionOptions = (uri) => {
    const uriHasDbName = /mongodb(?:\+srv)?:\/\/[^/]+\/[^^?]+/.test(uri);
    return {
      ...(!uriHasDbName && { dbName }),
      maxPoolSize: parseInt(process.env.DB_CONNECTION_POOL_SIZE) || 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority',
    };
  };

  const tryConnect = async (uri, label) => {
    try {
      logger.info(`Attempting ${label} MongoDB connection...`, { uri: uri.split('@')[1] || 'local' });
      await mongoose.connect(uri, formatConnectionOptions(uri));
      logger.info(`Connected to ${label} MongoDB`, { label });
      return true;
    } catch (err) {
      logger.warn(`Failed to connect to ${label} MongoDB`, { error: err.message });
      return false;
    }
  };

  if (atlasUri) {
    logger.info('Attempting MongoDB Atlas connection...');
    const atlasConnected = await tryConnect(atlasUri, 'Atlas');
    if (atlasConnected) return;

    logger.info('Atlas connection failed; attempting local MongoDB fallback...');
    const localConnected = await tryConnect(localUri, 'local');
    if (localConnected) return;
  } else {
    logger.info('No MONGO_URI provided; attempting local MongoDB...');
    const localConnected = await tryConnect(localUri, 'local');
    if (localConnected) return;
  }

  setDatabaseReady(false);
  logger.error('All MongoDB connection attempts failed. Continuing with in-memory fallback.', {
    hint: 'If using Atlas, verify credentials, Network Access IP whitelist, and URI includes correct database name'
  });
};

if (isMainModule) {
  connectMongoDB().finally(() => {
    startServer(PORT);
  });
}

export default app;
