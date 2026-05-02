// ─── Incident Types ─────────────────────────────────────────

export type IncidentCategory =
  | 'recruitment'
  | 'propaganda'
  | 'meeting'
  | 'surveillance'
  | 'harassment'
  | 'adversary_profile'
  | 'other';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus =
  | 'reported'
  | 'verified'
  | 'resolved'
  | 'false_positive';

export interface Incident {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  description: string;
  locationId: string;
  landmark?: string;
  reporterId: string;
  timestamp: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  mediaUrls: string[];
  isAnonymous: boolean;
  verifiedBy: string[];
  verificationCount: number;
  trustPoints: number;
  coordinates: number[];
  tags: string[];
}

export interface CreateIncidentData {
  title: string;
  description: string;
  locationId?: string;
  landmark?: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  mediaUrls?: string[];
  media?: Blob[];
  isAnonymous: boolean;
  coordinates?: number[];
  tags?: string[];
}

export interface IncidentFilters {
  category?: IncidentCategory;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  area?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PendingIncident extends CreateIncidentData {
  offlineId: string;
  submittedAt: string;
  syncStatus: 'pending' | 'syncing' | 'failed';
}
