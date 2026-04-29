// ─── Encryption Service ─────────────────────────────────────

import { generateAESKey, encryptAES, decryptAES, exportAESKey, importAESKey } from '@/lib/crypto/aes';
import type { EncryptedPayload } from '@/types/auth.types';

const AES_KEY_STORAGE = 'rssokhla-encryption-key';

/**
 * Get or generate the local encryption key.
 * Key is stored in localStorage (browser only).
 */
export async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  if (typeof window === 'undefined') {
    throw new Error('Encryption is only available in the browser');
  }

  const stored = localStorage.getItem(AES_KEY_STORAGE);
  if (stored) {
    return importAESKey(stored);
  }

  const key = await generateAESKey(true);
  const exported = await exportAESKey(key);
  localStorage.setItem(AES_KEY_STORAGE, exported);
  return key;
}

/**
 * Encrypt sensitive text content before storing in database.
 */
export async function encryptContent(plaintext: string): Promise<EncryptedPayload> {
  const key = await getOrCreateEncryptionKey();
  return encryptAES(plaintext, key);
}

/**
 * Decrypt content retrieved from database.
 */
export async function decryptContent(payload: EncryptedPayload): Promise<string> {
  const key = await getOrCreateEncryptionKey();
  return decryptAES(payload, key);
}

/**
 * Check if encryption is enabled and available.
 */
export function isEncryptionAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof crypto !== 'undefined' &&
    typeof crypto.subtle !== 'undefined' &&
    process.env.NEXT_PUBLIC_ENCRYPTION_ENABLED === 'true'
  );
}
