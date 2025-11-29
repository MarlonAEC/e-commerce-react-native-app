/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Additional context/metadata to include with log messages
 */
export interface LogContext {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Log entry structure
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
  timestamp: Date;
}

/**
 * Logger interface that all logger implementations must follow
 * This abstraction allows swapping between different logging providers
 * (console, Sentry, Crashlytics, etc.) without changing the rest of the codebase
 */
export interface ILogger {
  /**
   * Log a debug message
   * @param message - The message to log
   * @param context - Optional context/metadata
   */
  debug(message: string, context?: LogContext): void;

  /**
   * Log an info message
   * @param message - The message to log
   * @param context - Optional context/metadata
   */
  info(message: string, context?: LogContext): void;

  /**
   * Log a warning message
   * @param message - The message to log
   * @param context - Optional context/metadata
   */
  warn(message: string, context?: LogContext): void;

  /**
   * Log an error message
   * @param message - The message to log
   * @param error - Optional error object
   * @param context - Optional context/metadata
   */
  error(message: string, error?: Error, context?: LogContext): void;

  /**
   * Set the minimum log level
   * Messages below this level will be ignored
   * @param level - The minimum log level
   */
  setLevel(level: LogLevel): void;

  /**
   * Get the current minimum log level
   */
  getLevel(): LogLevel;
}

