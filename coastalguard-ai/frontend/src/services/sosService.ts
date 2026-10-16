import { apiRequest } from './api';
import type { Language } from '../types';

export interface SOSCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}

export interface SOSFishermanProfile {
  id: string;
  name: string;
  contact: string;
  homeHarbour: string;
  vesselName: string;
  registrationNo: string;
}

export interface SOSRequestPayload {
  idempotencyKey: string;
  deviceCoordinates?: SOSCoordinates | null;
  emergencyNotes?: string;
  language: Language;
}

export interface SOSIncidentResponse {
  status: 'received' | 'duplicate_recorded' | 'error';
  incidentId: string;
  idempotencyKey: string;
  timestamp: string;
  fisherman: SOSFishermanProfile;
  deviceLocation?: SOSCoordinates | null;
  locationStatus: string;
  databasePersistence: string;
  notificationDispatchStatus: string;
  disclaimer: string;
  emergencyContacts: {
    vhf_channel: string;
    coast_guard_helpline: string;
    marine_police: string;
    national_emergency: string;
  };
}

/**
 * Submit an emergency SOS distress alert to the FastAPI backend.
 * Uses an idempotency key to prevent accidental duplicate incidents on network retries.
 */
export async function submitSosAlert(
  payload: SOSRequestPayload
): Promise<SOSIncidentResponse> {
  return apiRequest<SOSIncidentResponse>(
    '/api/sos',
    {
      method: 'POST',
      body: JSON.stringify({
        idempotencyKey: payload.idempotencyKey,
        deviceCoordinates: payload.deviceCoordinates || null,
        emergencyNotes: payload.emergencyNotes || null,
        language: payload.language,
      }),
    },
    20000 // 20-second emergency timeout
  );
}

/**
 * Fetch status of an existing emergency incident reference.
 */
export async function getSosIncident(incidentId: string): Promise<SOSIncidentResponse> {
  return apiRequest<SOSIncidentResponse>(`/api/sos/${encodeURIComponent(incidentId)}`);
}
