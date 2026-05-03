/**
 * Centralized Error Logging Utility
 * Captures, formats, and optionally transmits logs to external services/Appwrite.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private static instance: Logger;
  
  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private capture(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'node',
    };

    // Format for console
    const colorMap = {
      info: '\x1b[34m', // Blue
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      fatal: '\x1b[41m\x1b[37m', // Red bg, White text
    };
    const reset = '\x1b[0m';
    
    const consoleMsg = `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`;

    if (process.env.NODE_ENV !== 'production') {
      if (level === 'error' || level === 'fatal') {
        console.error(colorMap[level] + consoleMsg + reset, context || '');
      } else if (level === 'warn') {
        console.warn(colorMap[level] + consoleMsg + reset, context || '');
      } else {
        console.log(colorMap[level] + consoleMsg + reset, context || '');
      }
    } else {
      // In production, we'd send this to Sentry, DataDog, or an Appwrite Logs collection.
      // For now, ensuring it gets caught by standard stdout for container logging
      console.error(JSON.stringify(entry));
    }
  }

  public info(message: string, context?: Record<string, unknown>) {
    this.capture('info', message, context);
  }

  public warn(message: string, context?: Record<string, unknown>) {
    this.capture('warn', message, context);
  }

  public error(message: string | Error, context?: Record<string, unknown>) {
    const msg = message instanceof Error ? message.message : message;
    const ctx = message instanceof Error ? { ...context, stack: message.stack } : context;
    this.capture('error', msg, ctx);
  }

  public fatal(message: string | Error, context?: Record<string, unknown>) {
    const msg = message instanceof Error ? message.message : message;
    const ctx = message instanceof Error ? { ...context, stack: message.stack } : context;
    this.capture('fatal', msg, ctx);
  }
}

export const logger = Logger.getInstance();
