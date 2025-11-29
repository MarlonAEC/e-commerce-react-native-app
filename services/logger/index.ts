/**
 * Logger module exports
 *
 * @example
 * ```ts
 * import { logger } from '@/services/logger';
 *
 * // Basic usage
 * logger.info('User logged in');
 * logger.error('Failed to fetch data', error);
 *
 * // With context
 * logger.debug('API request', { endpoint: '/api/users', method: 'GET' });
 *
 * // Set log level
 * logger.setLevel(LogLevel.WARN); // Only log warnings and errors
 * ```
 */

export { ConsoleLogger } from "./console-logger";
export { getLogger, logger, resetLogger, setLogger } from "./logger";
export { LogLevel } from "./types";
export type { ILogger, LogContext, LogEntry } from "./types";

