import { ConsoleLogger } from "./console-logger";
import { ILogger, LogLevel } from "./types";

/**
 * Global logger instance
 * Can be replaced with any implementation that follows the ILogger interface
 */
let loggerInstance: ILogger = new ConsoleLogger(
  __DEV__ ? LogLevel.DEBUG : LogLevel.INFO
);

/**
 * Get the current logger instance
 */
export function getLogger(): ILogger {
  return loggerInstance;
}

/**
 * Set a custom logger implementation
 * This allows swapping the logger with third-party providers like Sentry, Crashlytics, etc.
 *
 * @example
 * ```ts
 * import { setLogger } from '@/services/logger';
 * import { SentryLogger } from '@/services/logger/sentry-logger';
 *
 * // In your app initialization
 * setLogger(new SentryLogger());
 * ```
 */
export function setLogger(logger: ILogger): void {
  loggerInstance = logger;
}

/**
 * Reset logger to default console logger
 */
export function resetLogger(): void {
  loggerInstance = new ConsoleLogger(__DEV__ ? LogLevel.DEBUG : LogLevel.INFO);
}

/**
 * Convenience functions that delegate to the current logger instance
 * These are the main functions you'll use throughout the app
 */
export const logger = {
  debug: (message: string, context?: Parameters<ILogger["debug"]>[1]) => {
    loggerInstance.debug(message, context);
  },
  info: (message: string, context?: Parameters<ILogger["info"]>[1]) => {
    loggerInstance.info(message, context);
  },
  warn: (message: string, context?: Parameters<ILogger["warn"]>[1]) => {
    loggerInstance.warn(message, context);
  },
  error: (
    message: string,
    error?: Error,
    context?: Parameters<ILogger["error"]>[2]
  ) => {
    loggerInstance.error(message, error, context);
  },
  setLevel: (level: LogLevel) => {
    loggerInstance.setLevel(level);
  },
  getLevel: () => {
    return loggerInstance.getLevel();
  },
};

