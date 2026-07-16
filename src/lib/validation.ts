export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/[\n\r]/g, ' ')
    .replace(/[\\$(){}\[\]"'`]/g, '')
    .trim()
    .slice(0, 1000);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validateName(name: string): boolean {
  return name.length >= 1 && name.length <= 100 && !/[<>]/.test(name);
}

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}
