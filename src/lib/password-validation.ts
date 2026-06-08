export interface PasswordValidation {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('At least 8 characters');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('One uppercase letter');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('One lowercase letter');
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    errors.push('One number');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('One special character (!@#$%^&*)');
  } else {
    score += 1;
  }

  let strength: PasswordValidation['strength'] = 'weak';
  if (score >= 5) strength = 'strong';
  else if (score >= 4) strength = 'good';
  else if (score >= 3) strength = 'fair';

  return {
    valid: errors.length === 0,
    errors,
    strength,
    score,
  };
}
