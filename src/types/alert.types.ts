// ─── Alert Types ────────────────────────────────────────────

import type { IncidentSeverity } from './incident.types';

export interface Alert {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  message: string;
  affectedAreas: string[];
  severity: IncidentSeverity;
  timestamp: string;
  isActive: boolean;
  createdBy: string;
  expiresAt: string;
}

export interface CreateAlertData {
  title: string;
  message: string;
  affectedAreas: string[];
  severity: IncidentSeverity;
  expiresAt?: string;
}
