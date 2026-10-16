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

export type BackendStatus = 'checking' | 'connected' | 'disconnected' | 'error';

export type TrackingSource = 'LIVE_AIS' | 'NAVIC_GPS' | 'MOBILE_APP' | 'SIMULATED_DEMO' | 'LIVE_GPS';
export type VesselType = 'Mechanized Trawler' | 'Fiber Motorboat' | 'Traditional Catamaran' | 'Coastal Cargo' | 'Patrol Craft' | 'Fishing Vessel';

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
  signalStrength: 'Strong' | 'Degraded' | 'Offline' | 'Stale';
  speedKnots?: number | null;
  headingDegrees?: number | null;
  lastUpdateMinutes?: number;
  isLiveGps?: boolean;
  isDemo?: boolean;
  vesselType?: VesselType | string;
  trackingSource?: TrackingSource;
  mmsi?: string;
  accuracyMeters?: number | null;
  sessionId?: string;
  serverReceivedAt?: string | number;
  serverReceivedEpoch?: number;
  deviceTimestamp?: string | number;
  deviceTimestampMs?: number;
}

export interface GpsTelemetryPayload {
  vesselId: string;
  sessionId: string;
  latitude: number;
  longitude: number;
  coordinates?: [number, number];
  accuracyMeters: number;
  deviceTimestamp: number | string;
  deviceTimestampMs?: number;
  speedKnots?: number | null;
  headingDegrees?: number | null;
  altitudeMeters?: number | null;
  trackingSource?: TrackingSource;
}

export interface IngestTelemetryResponse {
  status: 'accepted' | 'updated';
  vesselId: string;
  sessionId: string;
  receivedAt: string;
  isLiveGps: boolean;
  vessel?: VesselReport;
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

export type SosStatus = 'ACTIVE_DISTRESS' | 'ACKNOWLEDGED' | 'SEARCH_AND_RESCUE_DISPATCHED' | 'RESOLVED' | 'FALSE_ALARM';
export type SosLocationSource = 'PHONE_GEOLOCATION' | 'VESSEL_LAST_KNOWN_REPORT' | 'UNAVAILABLE';

export interface EmergencySosRequest {
  id: string;
  userId: string;
  userName: string | null;
  userContact: string | null;
  homeHarbour: string | null;
  vesselName: string | null;
  registrationNo: string | null;
  vesselType?: string | null;
  coordinates: [number, number] | null;
  accuracyMeters: number | null;
  locationSource: SosLocationSource;
  deviceTimestamp: string | null;
  serverReceivedAt: string;
  serverReceivedEpoch: number;
  status: SosStatus;
  notes?: string;
}

export interface SosSubmissionPayload {
  userId?: string;
  deviceCoordinates?: [number, number] | null;
  deviceAccuracyMeters?: number | null;
  deviceGpsTimestamp?: string | number | null;
  deviceGpsAvailable: boolean;
}

export interface SosSubmissionResponse {
  status: string;
  sosId: string;
  serverReceivedAt: string;
  message: string;
  sos: EmergencySosRequest;
}

