// ─── User Types ─────────────────────────────────────────────

export type TrustLevel = 'new' | 'established' | 'trusted';

export type UserRole =
  | 'anonymous_user'
  | 'registered_user'
  | 'verified_reporter'
  | 'moderator'
  | 'admin';

export interface AppUser {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  username: string;
  email: string;
  isAnonymous: boolean;
  reputation: number;
  reportsSubmitted: number;
  verificationsProvided: number;
  joinDate: string;
  lastActive: string;
  deviceId: string;
  trustLevel: TrustLevel;
  areasMonitored: string[];
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserSession {
  userId: string;
  sessionId: string;
  role: UserRole;
  isAnonymous: boolean;
  expiresAt: string;
}

/** Permission matrix for role-based access control */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  anonymous_user: [
    'incidents:read',
    'incidents:create',
    'alerts:read',
  ],
  registered_user: [
    'incidents:read',
    'incidents:create',
    'incidents:update_own',
    'reports:create',
    'alerts:read',
    'profile:read',
    'profile:update',
  ],
  verified_reporter: [
    'incidents:read',
    'incidents:create',
    'incidents:update_own',
    'incidents:verify',
    'reports:read',
    'reports:create',
    'alerts:read',
    'profile:read',
    'profile:update',
  ],
  moderator: [
    'incidents:read',
    'incidents:create',
    'incidents:update',
    'incidents:delete',
    'incidents:verify',
    'reports:read',
    'reports:create',
    'reports:verify',
    'alerts:read',
    'alerts:create',
    'alerts:update',
    'locations:create',
    'locations:update',
    'profile:read',
    'profile:update',
  ],
  admin: [
    'incidents:read',
    'incidents:create',
    'incidents:update',
    'incidents:delete',
    'incidents:verify',
    'reports:read',
    'reports:create',
    'reports:verify',
    'alerts:read',
    'alerts:create',
    'alerts:update',
    'alerts:delete',
    'locations:create',
    'locations:update',
    'locations:delete',
    'users:read',
    'users:update',
    'users:delete',
    'security:read',
    'profile:read',
    'profile:update',
  ],
};
