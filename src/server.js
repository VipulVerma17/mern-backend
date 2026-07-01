import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { setDatabaseReady } from './dataStore.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'College Management API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/notices', noticeRoutes);

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(error);
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
    console.log('MongoDB connected');
  });

  mongoose.connection.on('disconnected', () => {
    setDatabaseReady(false);
    console.warn('MongoDB disconnected, continuing with in-memory fallback');
  });

  const formatConnectionOptions = (uri) => {
    const uriHasDbName = /mongodb(?:\+srv)?:\/\/[^/]+\/[^^?]+/.test(uri);
    return uriHasDbName ? {} : { dbName };
  };

  const tryConnect = async (uri, label) => {
    try {
      await mongoose.connect(uri, formatConnectionOptions(uri));
      console.log(`Connected to ${label} MongoDB`);
      return true;
    } catch (err) {
      console.warn(`Failed to connect to ${label} MongoDB:`, err.message);
      return false;
    }
  };

  if (atlasUri) {
    console.log('Attempting MongoDB Atlas connection...');
    const atlasConnected = await tryConnect(atlasUri, 'Atlas');
    if (atlasConnected) return;

    console.log('Atlas connection failed; attempting local MongoDB fallback...');
    const localConnected = await tryConnect(localUri, 'local');
    if (localConnected) return;
  } else {
    console.log('No MONGO_URI provided; attempting local MongoDB...');
    const localConnected = await tryConnect(localUri, 'local');
    if (localConnected) return;
  }

  setDatabaseReady(false);
  console.error('All MongoDB connection attempts failed. Continuing with in-memory fallback.');
  console.error('If you are using Atlas, verify credentials, Network Access IP whitelist, and that the URI includes the correct database name.');
};

connectMongoDB().finally(() => {
  startServer(PORT);
});
