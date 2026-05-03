// ─── Device Fingerprinting ──────────────────────────────────
// Composite fingerprint for preventing duplicate accounts and infiltration

import type { DeviceFingerprint } from '@/types/auth.types';

/**
 * Generate a composite device fingerprint from browser characteristics.
 * Uses canvas rendering, WebGL info, screen, and hardware data.
 */
export async function generateFingerprint(): Promise<DeviceFingerprint> {
  const canvas = getCanvasFingerprint();
  const webgl = getWebGLInfo();
  const screen = getScreenInfo();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language || 'unknown';
  const hardwareConcurrency = navigator.hardwareConcurrency || 0;
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const raw = [canvas, webgl, screen, timezone, language, hardwareConcurrency, touchSupport].join('|');
  const hash = await sha256(raw);

  return {
    hash,
    canvas,
    webgl,
    screen,
    timezone,
    language,
    hardwareConcurrency,
    touchSupport,
  };
}

/**
 * Canvas fingerprint — renders text and shapes, then hashes the pixel data.
 * Different GPU/driver/OS combos produce subtly different renderings.
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('NyayFauj 🛡️', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('NyayFauj 🛡️', 4, 17);

    return canvas.toDataURL().slice(-50);
  } catch {
    return 'canvas-error';
  }
}

/**
 * WebGL renderer and vendor strings — identifies GPU hardware.
 */
function getWebGLInfo(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return 'no-webgl';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-info';

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string;
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;

    return `${vendor}|${renderer}`;
  } catch {
    return 'webgl-error';
  }
}

/**
 * Screen resolution + color depth.
 */
function getScreenInfo(): string {
  return `${screen.width}x${screen.height}x${screen.colorDepth}`;
}

/**
 * SHA-256 hash of a string using Web Crypto API.
 */
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
