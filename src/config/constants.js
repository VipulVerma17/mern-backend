export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  NO_TOKEN: 'No authentication token provided',
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
  RESOURCE_NOT_FOUND: 'Resource not found',
  DATABASE_ERROR: 'Database connection error',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

export const ROLE_PERMISSIONS = {
  admin: ['*'],
  faculty: ['view_students', 'manage_attendance', 'manage_marks'],
  student: ['view_own_data', 'view_notices'],
};

export const RATE_LIMIT_CONFIG = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
};

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRY || '7d',
};

export const DB_CONFIG = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/college-management',
  connectionPoolSize: parseInt(process.env.DB_CONNECTION_POOL_SIZE) || 10,
  retryWrites: true,
  w: 'majority',
};
