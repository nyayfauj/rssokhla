// ─── Report Types ───────────────────────────────────────────

export type MediaType = 'text' | 'image' | 'video' | 'audio';

export interface Report {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  incidentId: string;
  reporterId: string;
  timestamp: string;
  content: string;
  mediaType: MediaType;
  mediaUrl: string;
  location: number[];
  isVerified: boolean;
  verificationNotes: string;
}

export interface CreateReportData {
  incidentId: string;
  content: string;
  mediaType: MediaType;
  mediaUrl?: string;
  location?: number[];
}
