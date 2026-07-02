const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const LOG_LEVEL_PRIORITY = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLogLevel = process.env.LOG_LEVEL || 'info';

const formatLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    message,
    ...(Object.keys(meta).length > 0 && { meta }),
  };
};

const shouldLog = (level) => {
  const envLevel = (currentLogLevel || 'info').toUpperCase();
  return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[envLevel];
};

export const logger = {
  error: (message, meta = {}) => {
    if (shouldLog('ERROR')) {
      console.error(JSON.stringify(formatLog(LOG_LEVELS.ERROR, message, meta)));
    }
  },

  warn: (message, meta = {}) => {
    if (shouldLog('WARN')) {
      console.warn(JSON.stringify(formatLog(LOG_LEVELS.WARN, message, meta)));
    }
  },

  info: (message, meta = {}) => {
    if (shouldLog('INFO')) {
      console.log(JSON.stringify(formatLog(LOG_LEVELS.INFO, message, meta)));
    }
  },

  debug: (message, meta = {}) => {
    if (shouldLog('DEBUG')) {
      console.log(JSON.stringify(formatLog(LOG_LEVELS.DEBUG, message, meta)));
    }
  },
};

export default logger;
