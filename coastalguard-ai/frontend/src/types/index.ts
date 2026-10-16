export type SeverityLevel = 'low' | 'moderate' | 'high' | 'extreme';
export type BoatStatus = 'sample' | 'stale' | 'unknown';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type Language = 'en' | 'ta';

export interface MarineCondition {
  regionId: string;
  regionName: string;
  coastalZone: string;
  windSpeedKnots: number;
  windDirection: string;
  waveHeightMeters: number;
  swellPeriodSeconds: number;
  rainfallMm: number;
  visibilityKm: number;
  barometricPressureHpa: number;
  seaSurfaceTempC: number;
  forecastSummary: string;
  riskLevel: SeverityLevel;
  lastUpdated: string;
}

export interface HarbourPort {
  id: string;
  name: string;
  tamilName?: string;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  shelterCapacityBoats: number;
  vhfEmergencyChannel: string;
  depthMeters: number;
  isSafeHavens: boolean;
  status: 'Open' | 'Caution' | 'Closed to Entry';
}

export interface VesselReport {
  id: string;
  boatName: string;
  registrationNumber: string;
  ownerName: string;
  homePort: string;
  reportedLocation: string;
  coordinates: [number, number];
  lastReportedTime: string;
  status: BoatStatus;
  signalStrength: 'Strong' | 'Degraded' | 'Offline';
}

export interface SafetyAlert {
  id: string;
  title: string;
  titleTamil?: string;
  message: string;
  messageTamil?: string;
  coastalRegion: string;
  severity: SeverityLevel;
  issuedAt: string;
  validUntil: string;
  bulletinId: string;
  isActive: boolean;
  recommendedAction: string;
  recommendedActionTamil?: string;
}

export interface FishermanUser {
  id: string;
  name: string;
  contact: string;
  homeHarbour: string;
  vesselName: string;
  registrationNo: string;
  accountStatus: UserStatus;
  preferredLanguage: Language;
  joinedDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  textTamil?: string;
  timestamp: string;
  suggestedAction?: string;
}
