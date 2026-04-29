// ─── Auth Types ─────────────────────────────────────────────

import type { UserRole } from './user.types';

export interface AuthState {
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isLoading: boolean;
  userId: string | null;
  role: UserRole;
  sessionId: string | null;
}

export interface TwoFactorData {
  secret: string;
  uri: string;
  qrCodeDataUrl: string;
  recoveryCodes: string[];
}

export interface DeviceFingerprint {
  hash: string;
  canvas: string;
  webgl: string;
  screen: string;
  timezone: string;
  language: string;
  hardwareConcurrency: number;
  touchSupport: boolean;
}

export interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'session_refresh' | '2fa_enabled' | '2fa_verified' | 'suspicious_activity';
  timestamp: string;
  userId: string;
  ip?: string;
  deviceFingerprint?: string;
  details?: string;
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag?: string;
}
