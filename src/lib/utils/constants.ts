// ─── Application Constants ──────────────────────────────────

export const APP_NAME = 'NyayFauj';
export const APP_DESCRIPTION = 'Community safety monitoring for Okhla';
export const APP_VERSION = '1.0.0';

/** Incident categories with display labels and icons */
export const INCIDENT_CATEGORIES = {
  recruitment:   { label: 'Recruitment',   icon: '🎯', color: '#ef4444' },
  propaganda:    { label: 'Propaganda',    icon: '📢', color: '#f97316' },
  meeting:       { label: 'Meeting',       icon: '🤝', color: '#eab308' },
  surveillance:  { label: 'Surveillance',  icon: '👁️', color: '#8b5cf6' },
  harassment:    { label: 'Harassment',    icon: '⚠️', color: '#dc2626' },
  adversary_profile: { label: 'Operative Profile', icon: '👤', color: '#991b1b' },
  other:         { label: 'Other',         icon: '📋', color: '#6b7280' },
} as const;

/** Severity levels with display metadata */
export const SEVERITY_LEVELS = {
  low:      { label: 'Low',      color: '#22c55e', bg: 'bg-green-500/10',   text: 'text-green-400' },
  medium:   { label: 'Medium',   color: '#f59e0b', bg: 'bg-amber-500/10',   text: 'text-amber-400' },
  high:     { label: 'High',     color: '#ef4444', bg: 'bg-red-500/10',     text: 'text-red-400' },
  critical: { label: 'Critical', color: '#dc2626', bg: 'bg-red-600/10',     text: 'text-red-500' },
} as const;

/** Status display metadata */
export const STATUS_LABELS = {
  reported:       { label: 'Reported',       color: '#3b82f6' },
  verified:       { label: 'Verified',       color: '#22c55e' },
  resolved:       { label: 'Resolved',       color: '#6b7280' },
  false_positive: { label: 'False Positive', color: '#a1a1aa' },
} as const;

/** Rate limiting configuration */
export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 60,
  LOGIN_ATTEMPTS_PER_HOUR: 10,
  REPORT_SUBMISSIONS_PER_HOUR: 20,
} as const;

/** Session configuration */
export const SESSION_CONFIG = {
  INACTIVITY_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_INTERVAL_MS: 15 * 60 * 1000, // 15 minutes
  MAX_SESSIONS_PER_USER: 3,
} as const;

/** Okhla center coordinates for default map view */
export const OKHLA_CENTER: [number, number] = [28.5400, 77.2700];
export const DEFAULT_MAP_ZOOM = 14;
