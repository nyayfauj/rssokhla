// ─── Permission Helpers ─────────────────────────────────────

import { Permission, Role } from 'appwrite';

/**
 * Generate document-level permissions for a user-owned document.
 * Owner gets full CRUD, moderators/admins get read + update.
 */
export function ownerPermissions(userId: string): string[] {
  return [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
    Permission.read(Role.team('moderators')),
    Permission.update(Role.team('moderators')),
    Permission.read(Role.team('admins')),
    Permission.update(Role.team('admins')),
    Permission.delete(Role.team('admins')),
  ];
}

/**
 * Permissions for publicly readable documents that only moderators+ can modify.
 */
export function publicReadPermissions(): string[] {
  return [
    Permission.read(Role.users()),
    Permission.update(Role.team('moderators')),
    Permission.delete(Role.team('admins')),
  ];
}

/**
 * Permissions for anonymous incident submissions.
 * Readable by all authenticated users, but no individual owner update/delete.
 */
export function anonymousSubmissionPermissions(): string[] {
  return [
    Permission.read(Role.users()),
    Permission.update(Role.team('moderators')),
    Permission.delete(Role.team('moderators')),
  ];
}

/**
 * Permissions for sensitive reports — only reporter + moderators can read.
 */
export function sensitiveReportPermissions(reporterId: string): string[] {
  return [
    Permission.read(Role.user(reporterId)),
    Permission.read(Role.team('moderators')),
    Permission.update(Role.team('moderators')),
    Permission.read(Role.team('admins')),
    Permission.update(Role.team('admins')),
    Permission.delete(Role.team('admins')),
  ];
}
