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

export async function logEvent(options: LogOptions): Promise<void> {
  try {
    await fetch('/api/db/systemLogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: options.level || 'info',
        category: options.category || 'system',
        message: options.message,
        details: options.details || '',
        userId: options.userId || '',
        userEmail: options.userEmail || '',
        userRole: options.userRole || '',
        path: options.path || '',
        method: options.method || '',
        statusCode: options.statusCode || 0,
        duration: options.duration || 0,
      }),
    });
  } catch (e) {
    // Silently fail - logging should not break the app
    console.error('Failed to log event:', e);
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
