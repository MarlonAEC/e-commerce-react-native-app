# Logger Service

A flexible, abstracted logging service that allows easy integration with third-party logging providers like Sentry, Crashlytics, etc.

## Features

- **Abstraction Layer**: The logger interface is completely abstracted from third-party implementations
- **Easy Integration**: Swap between different logging providers without changing your codebase
- **Log Levels**: Support for DEBUG, INFO, WARN, and ERROR levels
- **Context Support**: Include additional metadata/context with log messages
- **Error Handling**: Built-in support for logging errors with stack traces
- **Environment Aware**: Automatically adjusts log level based on development/production

## Basic Usage

```typescript
import { logger } from '@/services/logger';

// Simple logging
logger.info('User logged in');
logger.warn('Low battery detected');
logger.error('Failed to fetch data', error);

// With context/metadata
logger.debug('API request', {
  endpoint: '/api/users',
  method: 'GET',
  userId: '123',
});

logger.error('Payment failed', paymentError, {
  orderId: '456',
  amount: 99.99,
  paymentMethod: 'credit_card',
});
```

## Setting Log Levels

```typescript
import { logger, LogLevel } from '@/services/logger';

// Only log warnings and errors in production
logger.setLevel(LogLevel.WARN);

// Get current log level
const currentLevel = logger.getLevel();
```

## Custom Logger Implementation

To integrate with a third-party provider (e.g., Sentry, Crashlytics):

### 1. Create a custom logger class

```typescript
// services/logger/sentry-logger.ts
import { ILogger, LogContext, LogLevel } from './types';
import * as Sentry from '@sentry/react-native';

export class SentryLogger implements ILogger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  debug(message: string, context?: LogContext): void {
    if (this.minLevel <= LogLevel.DEBUG) {
      Sentry.addBreadcrumb({
        message,
        level: 'debug',
        data: context,
      });
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.minLevel <= LogLevel.INFO) {
      Sentry.addBreadcrumb({
        message,
        level: 'info',
        data: context,
      });
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.minLevel <= LogLevel.WARN) {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: context,
      });
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.minLevel <= LogLevel.ERROR) {
      Sentry.captureException(error || new Error(message), {
        extra: { message, ...context },
      });
    }
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  getLevel(): LogLevel {
    return this.minLevel;
  }
}
```

### 2. Initialize in your app

```typescript
// app/_layout.tsx or App.tsx
import { setLogger } from '@/services/logger';
import { SentryLogger } from '@/services/logger/sentry-logger';
import * as Sentry from '@sentry/react-native';

// Initialize Sentry
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  // ... other config
});

// Replace default logger with Sentry logger
setLogger(new SentryLogger());
```

## Hybrid Approach

You can also create a logger that combines multiple providers:

```typescript
// services/logger/hybrid-logger.ts
import { ILogger, LogContext, LogLevel } from './types';
import { ConsoleLogger } from './console-logger';
import { SentryLogger } from './sentry-logger';

export class HybridLogger implements ILogger {
  private consoleLogger: ConsoleLogger;
  private sentryLogger: SentryLogger;

  constructor() {
    this.consoleLogger = new ConsoleLogger();
    this.sentryLogger = new SentryLogger();
  }

  debug(message: string, context?: LogContext): void {
    this.consoleLogger.debug(message, context);
    this.sentryLogger.debug(message, context);
  }

  // ... implement other methods similarly
}
```

## API Reference

### `logger.debug(message, context?)`
Logs a debug message. Only shown in development by default.

### `logger.info(message, context?)`
Logs an informational message.

### `logger.warn(message, context?)`
Logs a warning message.

### `logger.error(message, error?, context?)`
Logs an error message with optional error object and context.

### `logger.setLevel(level)`
Sets the minimum log level. Messages below this level will be ignored.

### `logger.getLevel()`
Returns the current minimum log level.

### `setLogger(logger)`
Replaces the global logger instance with a custom implementation.

### `resetLogger()`
Resets the logger to the default console logger.

## Log Levels

- `LogLevel.DEBUG` (0): Detailed information for debugging
- `LogLevel.INFO` (1): General informational messages
- `LogLevel.WARN` (2): Warning messages for potentially harmful situations
- `LogLevel.ERROR` (3): Error messages for error events

