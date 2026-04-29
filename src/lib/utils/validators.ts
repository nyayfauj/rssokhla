// ─── Validation Utilities ───────────────────────────────────

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isStrongPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Must contain at least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Must contain at least one number');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Must contain at least one special character');

  return { valid: errors.length === 0, errors };
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,32}$/.test(username);
}

export function isValidCoordinates(coords: number[]): boolean {
  if (coords.length !== 2) return false;
  const [lat, lng] = coords;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export function isValidTOTP(code: string): boolean {
  return /^\d{6}$/.test(code);
}
