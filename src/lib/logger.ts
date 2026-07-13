type LogLevel = 'info' | 'warn' | 'error' | 'success';
type LogCategory = 'auth' | 'order' | 'product' | 'user' | 'system' | 'api';

interface LogOptions {
  level?: LogLevel;
  category?: LogCategory;
  message: string;
  details?: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
}

// In-memory log storage for development (replace with proper logging service in production)
const logs: Array<LogOptions & { timestamp: Date }> = [];
const MAX_LOGS = 1000;

export async function logEvent(options: LogOptions): Promise<void> {
  try {
    // Store log in memory (for development)
    if (process.env.NODE_ENV === 'development') {
      logs.push({ ...options, timestamp: new Date() });
      if (logs.length > MAX_LOGS) {
        logs.shift(); // Remove oldest log
      }
    }
    
    // In production, you would send this to a logging service like:
    // - Datadog, LogRocket, Sentry, etc.
    // - Or your own API endpoint
    
    // For now, just log to console in development
    if (process.env.NODE_ENV === 'development') {
      const logMessage = `[${options.level?.toUpperCase() || 'INFO'}] [${options.category || 'system'}] ${options.message}`;
      if (options.level === 'error') {
        console.error(logMessage, options.details || '');
      } else if (options.level === 'warn') {
        console.warn(logMessage, options.details || '');
      } else {
        console.log(logMessage, options.details || '');
      }
    }
  } catch (e) {
    // Silently fail - logging should not break the app
  }
}

export function logAuth(message: string, details?: string) {
  return logEvent({ level: 'info', category: 'auth', message, details });
}

export function logOrder(message: string, details?: string) {
  return logEvent({ level: 'info', category: 'order', message, details });
}

export function logProduct(message: string, details?: string) {
  return logEvent({ level: 'info', category: 'product', message, details });
}

export function logUser(message: string, details?: string) {
  return logEvent({ level: 'info', category: 'user', message, details });
}

export function logError(message: string, details?: string) {
  return logEvent({ level: 'error', category: 'system', message, details });
}

export function logWarning(message: string, details?: string) {
  return logEvent({ level: 'warn', category: 'system', message, details });
}

export function logSuccess(message: string, details?: string) {
  return logEvent({ level: 'success', category: 'system', message, details });
}
