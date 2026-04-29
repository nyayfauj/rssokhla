// ─── RSA-OAEP Key Exchange ──────────────────────────────────
// Used for wrapping/unwrapping AES keys for secure transmission

const RSA_ALGORITHM = 'RSA-OAEP';
const RSA_HASH = 'SHA-256';
const RSA_MODULUS_LENGTH = 2048;

export interface RSAKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

/**
 * Generate an RSA-OAEP key pair for key exchange.
 * Public key encrypts (wraps) AES keys, private key decrypts (unwraps).
 */
export async function generateRSAKeyPair(): Promise<RSAKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: RSA_ALGORITHM,
      modulusLength: RSA_MODULUS_LENGTH,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: RSA_HASH,
    },
    true,
    ['wrapKey', 'unwrapKey']
  );

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

/**
 * Wrap (encrypt) an AES key using an RSA public key for secure transport.
 */
export async function wrapAESKey(
  aesKey: CryptoKey,
  rsaPublicKey: CryptoKey
): Promise<string> {
  const wrappedBuffer = await crypto.subtle.wrapKey(
    'raw',
    aesKey,
    rsaPublicKey,
    RSA_ALGORITHM
  );
  return bufferToBase64(wrappedBuffer);
}

/**
 * Unwrap (decrypt) an AES key using an RSA private key.
 */
export async function unwrapAESKey(
  wrappedKeyBase64: string,
  rsaPrivateKey: CryptoKey
): Promise<CryptoKey> {
  const wrappedBuffer = base64ToBuffer(wrappedKeyBase64);
  return crypto.subtle.unwrapKey(
    'raw',
    wrappedBuffer,
    rsaPrivateKey,
    { name: RSA_ALGORITHM } as Algorithm,
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Export RSA public key as base64-encoded SPKI format for transmission.
 */
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('spki', publicKey);
  return bufferToBase64(exported);
}

/**
 * Import RSA public key from base64-encoded SPKI format.
 */
export async function importPublicKey(base64Key: string): Promise<CryptoKey> {
  const keyBuffer = base64ToBuffer(base64Key);
  return crypto.subtle.importKey(
    'spki',
    keyBuffer,
    { name: RSA_ALGORITHM, hash: RSA_HASH },
    false,
    ['wrapKey']
  );
}

// ─── Helpers ────────────────────────────────────────────────

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
