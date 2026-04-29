// ─── Karyakarta Profile Types ───────────────────────────────

/** RSS organizational ranks */
export type KaryakartaRank =
  | 'swayamsevak'       // Basic volunteer
  | 'shakha_pramukh'    // Shakha head
  | 'karyavah'          // Secretary
  | 'sah_karyavah'      // Joint secretary
  | 'pracharak'         // Full-time propagator
  | 'vistarak'          // Expansion worker
  | 'boudhik_pramukh'   // Intellectual head
  | 'sharirik_pramukh'  // Physical training head
  | 'nagar_karyavah'    // City secretary
  | 'zila_pramukh'      // District head
  | 'unknown';

/** Affiliated organizations */
export type Affiliation =
  | 'rss'
  | 'vhp'
  | 'bajrang_dal'
  | 'bjp'
  | 'bjp_it_cell'
  | 'abvp'
  | 'vidya_bharati'
  | 'hindu_jagran_manch'
  | 'durga_vahini'
  | 'other';

/** Threat assessment level */
export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

/** Verification status of profile data */
export type ProfileVerification = 'unverified' | 'partially_verified' | 'verified' | 'disputed';

/** Activity type the karyakarta is known for */
export type ActivityType =
  | 'recruitment'
  | 'propaganda'
  | 'surveillance'
  | 'fundraising'
  | 'training'
  | 'intimidation'
  | 'social_media'
  | 'logistics'
  | 'leadership'
  | 'ground_operations'
  | 'other';

/** Social media profile */
export interface SocialMediaProfile {
  platform: 'facebook' | 'twitter' | 'instagram' | 'whatsapp' | 'telegram' | 'youtube' | 'linkedin' | 'tiktok' | 'other';
  handle: string;
  url?: string;
  isVerified?: boolean;
  followersCount?: number;
  notes?: string;
}

/** Address entry */
export interface AddressEntry {
  type: 'current' | 'previous' | 'workplace' | 'shakha' | 'frequent';
  address: string;
  area?: string;
  city?: string;
  pincode?: string;
  coordinates?: [number, number];
  since?: string;
  until?: string;
  notes?: string;
}

/** Employment / cover occupation */
export interface EmploymentRecord {
  occupation: string;
  employer?: string;
  address?: string;
  isCurrent: boolean;
  since?: string;
  until?: string;
  notes?: string;
}

/** Vehicle association */
export interface VehicleInfo {
  type: 'car' | 'motorcycle' | 'scooter' | 'auto' | 'van' | 'truck' | 'other';
  number?: string;
  make?: string;
  color?: string;
  description?: string;
}

/** Known associate link */
export interface AssociateLink {
  profileId: string;
  name: string;
  relationship: 'senior' | 'junior' | 'peer' | 'family' | 'business' | 'unknown';
  notes?: string;
}

/** Sighting / activity log entry */
export interface SightingEntry {
  date: string;
  location: string;
  area?: string;
  activity: ActivityType;
  description: string;
  reportedBy?: string;
  evidenceUrls?: string[];
  isVerified: boolean;
}

/** Physical description */
export interface PhysicalDescription {
  height?: string;
  build?: 'slim' | 'medium' | 'heavy' | 'muscular';
  complexion?: string;
  hairColor?: string;
  facialHair?: 'none' | 'beard' | 'mustache' | 'both' | 'goatee';
  distinguishingMarks?: string;
  ageEstimate?: string;
}

/** Full Karyakarta Profile */
export interface KaryakartaProfile {
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  // ─── Identity ──────────────────────────────────
  fullName: string;
  aliases: string[];
  fatherName?: string;
  dateOfBirth?: string;
  ageEstimate?: string;
  gender: 'male' | 'female' | 'other';
  photoUrls: string[];
  physicalDescription?: PhysicalDescription;

  // ─── Contact ───────────────────────────────────
  phoneNumbers: string[];
  emails: string[];
  socialMedia: SocialMediaProfile[];

  // ─── Location ──────────────────────────────────
  addresses: AddressEntry[];
  primaryArea: string;
  frequentLocations: string[];

  // ─── Organization ──────────────────────────────
  rank: KaryakartaRank;
  affiliations: Affiliation[];
  shakhaLocation?: string;
  shakhaTimings?: string;
  seniorContact?: string;
  involvementSince?: string;
  isActive: boolean;

  // ─── Activity ──────────────────────────────────
  knownActivities: ActivityType[];
  areasOfOperation: string[];
  linkedIncidentIds: string[];
  sightings: SightingEntry[];
  lastSeenDate?: string;
  lastSeenLocation?: string;

  // ─── Employment ────────────────────────────────
  employmentHistory: EmploymentRecord[];

  // ─── Vehicles ──────────────────────────────────
  vehicles: VehicleInfo[];

  // ─── Associates ────────────────────────────────
  associates: AssociateLink[];

  // ─── Intelligence ──────────────────────────────
  threatLevel: ThreatLevel;
  verificationStatus: ProfileVerification;
  reliabilityScore: number; // 0-100
  internalNotes: string;
  sources: string[];
  tags: string[];

  // ─── Meta ──────────────────────────────────────
  createdBy: string;
  updatedBy: string;
  isEncrypted: boolean;
}

/** Create profile payload */
export interface CreateKaryakartaData {
  fullName: string;
  aliases?: string[];
  fatherName?: string;
  dateOfBirth?: string;
  ageEstimate?: string;
  gender: 'male' | 'female' | 'other';
  photoUrls?: string[];
  physicalDescription?: PhysicalDescription;
  phoneNumbers?: string[];
  emails?: string[];
  socialMedia?: SocialMediaProfile[];
  addresses?: AddressEntry[];
  primaryArea?: string;
  rank?: KaryakartaRank;
  affiliations?: Affiliation[];
  shakhaLocation?: string;
  knownActivities?: ActivityType[];
  areasOfOperation?: string[];
  employmentHistory?: EmploymentRecord[];
  vehicles?: VehicleInfo[];
  threatLevel?: ThreatLevel;
  internalNotes?: string;
  tags?: string[];
}

// ─── Display Constants ──────────────────────────────────────

export const RANK_LABELS: Record<KaryakartaRank, { label: string; level: number }> = {
  swayamsevak:      { label: 'Swayamsevak',       level: 1 },
  shakha_pramukh:   { label: 'Shakha Pramukh',    level: 2 },
  karyavah:         { label: 'Karyavah',           level: 3 },
  sah_karyavah:     { label: 'Sah Karyavah',       level: 3 },
  boudhik_pramukh:  { label: 'Boudhik Pramukh',    level: 3 },
  sharirik_pramukh: { label: 'Sharirik Pramukh',   level: 3 },
  pracharak:        { label: 'Pracharak',          level: 4 },
  vistarak:         { label: 'Vistarak',           level: 4 },
  nagar_karyavah:   { label: 'Nagar Karyavah',     level: 5 },
  zila_pramukh:     { label: 'Zila Pramukh',       level: 6 },
  unknown:          { label: 'Unknown',            level: 0 },
};

export const AFFILIATION_LABELS: Record<Affiliation, { label: string; icon: string; color: string }> = {
  rss:                { label: 'RSS',              icon: '🏴', color: 'text-orange-400' },
  vhp:                { label: 'VHP',              icon: '🛕', color: 'text-orange-300' },
  bajrang_dal:        { label: 'Bajrang Dal',      icon: '⚔️', color: 'text-red-400' },
  bjp:                { label: 'BJP',              icon: '🪷', color: 'text-orange-500' },
  bjp_it_cell:        { label: 'BJP IT Cell',      icon: '💻', color: 'text-blue-400' },
  abvp:               { label: 'ABVP',             icon: '🎓', color: 'text-purple-400' },
  vidya_bharati:      { label: 'Vidya Bharati',    icon: '📚', color: 'text-yellow-400' },
  hindu_jagran_manch: { label: 'Hindu Jagran Manch', icon: '📢', color: 'text-amber-400' },
  durga_vahini:       { label: 'Durga Vahini',     icon: '🛡️', color: 'text-pink-400' },
  other:              { label: 'Other',            icon: '❓', color: 'text-zinc-400' },
};

export const ACTIVITY_LABELS: Record<ActivityType, { label: string; icon: string }> = {
  recruitment:       { label: 'Recruitment',        icon: '🎯' },
  propaganda:        { label: 'Propaganda',         icon: '📢' },
  surveillance:      { label: 'Surveillance',       icon: '👁️' },
  fundraising:       { label: 'Fundraising',        icon: '💰' },
  training:          { label: 'Training',           icon: '🏋️' },
  intimidation:      { label: 'Intimidation',       icon: '⚠️' },
  social_media:      { label: 'Social Media Ops',   icon: '📱' },
  logistics:         { label: 'Logistics',          icon: '🚛' },
  leadership:        { label: 'Leadership',         icon: '👔' },
  ground_operations: { label: 'Ground Operations',  icon: '🗺️' },
  other:             { label: 'Other',              icon: '📋' },
};

export const THREAT_COLORS: Record<ThreatLevel, { bg: string; text: string; border: string; label: string }> = {
  low:      { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/25', label: 'Low' },
  medium:   { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', label: 'Medium' },
  high:     { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/25', label: 'High' },
  critical: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/25', label: 'Critical' },
};
