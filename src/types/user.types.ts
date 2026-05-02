// ─── Tactical User Types ─────────────────────────────────────

export type TrustLevel = 'unverified' | 'operative' | 'verifier' | 'elite';

export type UserRole =
  | 'observer'      // Anonymous / Unregistered
  | 'operative'     // Standard registered reporter
  | 'verifier'      // Trusted agent who can verify reports
  | 'commander';    // Highly trusted decentralized admin

export interface AppUser {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  username: string;
  email: string;
  isAnonymous: boolean;
  reputation: number;        // Primary trust score
  reportsSubmitted: number;
  verificationsProvided: number;
  joinDate: string;
  lastActive: string;
  deviceId: string;
  trustLevel: TrustLevel;
  areasMonitored: string[];
  inviteCode?: string;       // Used for initial role assignment
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  inviteCode?: string;      // Optional tactical code
}

export interface UserSession {
  userId: string;
  sessionId: string;
  role: UserRole;
  isAnonymous: boolean;
  expiresAt: string;
}

/** Permission matrix for tactical decentralized monitoring */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  observer: [
    'incidents:read',
    'alerts:read',
  ],
  operative: [
    'incidents:read',
    'incidents:create',
    'incidents:update_own',
    'alerts:read',
    'profile:read',
  ],
  verifier: [
    'incidents:read',
    'incidents:create',
    'incidents:verify',      // Can add trust points to reports
    'reports:read',
    'alerts:read',
    'profile:read',
  ],
  commander: [
    'incidents:read',
    'incidents:create',
    'incidents:update',
    'incidents:delete',
    'incidents:verify',
    'alerts:read',
    'alerts:create',
    'alerts:update',
    'locations:create',
    'users:read',
  ],
};

/** Trust weighting for decentralized verification */
export const TRUST_WEIGHTS: Record<UserRole, number> = {
  observer: 0,
  operative: 1,
  verifier: 5,
  commander: 10,
};

/** Verification threshold: A report needs 10 trust points to be 'Community Verified' */
export const VERIFICATION_THRESHOLD = 10;
