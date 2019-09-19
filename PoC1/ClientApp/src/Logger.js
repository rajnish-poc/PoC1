import { LogglyTracker } from 'loggly-jslogger';

const logger = new LogglyTracker();

logger.push({ 'logglyKey': '18e84958-fd19-4615-b089-d467c36cbbcc' });

export default logger;