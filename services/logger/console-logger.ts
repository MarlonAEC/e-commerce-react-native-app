import { ILogger, LogContext, LogEntry, LogLevel } from "./types";

/**
 * Default console logger implementation
 * Logs to the native console (React Native Debugger, Metro, etc.)
 */
export class ConsoleLogger implements ILogger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.DEBUG) {
    this.minLevel = minLevel;
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, undefined, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, undefined, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, undefined, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, error, context);
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  getLevel(): LogLevel {
    return this.minLevel;
  }

  /**
   * Internal method to handle logging
   */
  private log(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: LogContext
  ): void {
    // Skip if below minimum level
    if (level < this.minLevel) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      context,
      error,
      timestamp: new Date(),
    };

    // Format log message
    const levelLabel = LogLevel[level];
    const timestamp = entry.timestamp.toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    const errorStr = error ? ` Error: ${error.message}` : "";

    const logMessage = `[${timestamp}] [${levelLabel}] ${message}${contextStr}${errorStr}`;

    // Use appropriate console method based on level
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage);
        if (context) {
          console.debug("Context:", context);
        }
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        if (context) {
          console.info("Context:", context);
        }
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        if (context) {
          console.warn("Context:", context);
        }
        if (error) {
          console.warn("Error:", error);
        }
        break;
      case LogLevel.ERROR:
        console.error(logMessage);
        if (context) {
          console.error("Context:", context);
        }
        if (error) {
          console.error("Error:", error);
          // Log stack trace if available
          if (error.stack) {
            console.error("Stack:", error.stack);
          }
        }
        break;
    }
  }
}

