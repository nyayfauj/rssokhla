// ─── Auth Service ───────────────────────────────────────────
// Business logic layer for authentication operations

import { account, ID } from '@/lib/appwrite/client';
import { databases } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import type { AppUser } from '@/types/user.types';

/**
 * Create a user profile document in the database after registration.
 */
export async function createUserProfile(
  userId: string,
  username: string,
  email: string,
  deviceId: string
): Promise<AppUser> {
  const now = new Date().toISOString();

  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.OPERATIVES,
    userId,
    {
      username,
      email,
      isAnonymous: false,
      reputation: 0,
      reportsSubmitted: 0,
      verificationsProvided: 0,
      joinDate: now,
      lastActive: now,
      deviceId,
      trustLevel: 'new',
      areasMonitored: [],
    }
  );

  return doc as unknown as AppUser;
}

/**
 * Create an anonymous user profile.
 */
export async function createAnonymousProfile(
  userId: string,
  deviceId: string
): Promise<AppUser> {
  const now = new Date().toISOString();

  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.OPERATIVES,
    userId,
    {
      username: `anon_${userId.slice(-6)}`,
      email: '',
      isAnonymous: true,
      reputation: 0,
      reportsSubmitted: 0,
      verificationsProvided: 0,
      joinDate: now,
      lastActive: now,
      deviceId,
      trustLevel: 'new',
      areasMonitored: [],
    }
  );

  return doc as unknown as AppUser;
}

/**
 * Update user's last activity timestamp.
 */
export async function updateLastActive(userId: string): Promise<void> {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.OPERATIVES,
      userId,
      { lastActive: new Date().toISOString() }
    );
  } catch {
    // Non-critical, don't throw
  }
}

/**
 * Get user profile from database.
 */
export async function getUserProfile(userId: string): Promise<AppUser | null> {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.OPERATIVES,
      userId
    );
    return doc as unknown as AppUser;
  } catch {
    return null;
  }
}

/**
 * Update user preferences for 2FA settings.
 */
export async function enable2FA(secret: string, recoveryCodes: string[]): Promise<void> {
  await account.updatePrefs({
    twoFactorEnabled: true,
    twoFactorSecret: secret,
    recoveryCodes: JSON.stringify(recoveryCodes),
  });
}

/**
 * Check if user has 2FA enabled.
 */
export async function has2FAEnabled(): Promise<boolean> {
  try {
    const prefs = await account.getPrefs();
    return prefs.twoFactorEnabled === true;
  } catch {
    return false;
  }
}

/**
 * Convert anonymous account to registered account.
 */
export async function convertAnonymousToRegistered(
  email: string,
  password: string,
  username: string
): Promise<void> {
  // Update the Appwrite account
  await account.updateEmail(email, password);

  // Get current user
  const user = await account.get();

  // Update the database profile
  await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.OPERATIVES,
    user.$id,
    {
      email,
      username,
      isAnonymous: false,
    }
  );
}
