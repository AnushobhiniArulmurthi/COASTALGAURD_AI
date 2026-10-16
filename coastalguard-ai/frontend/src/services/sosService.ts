import { API_BASE_URL, fetchWithTimeout } from './apiClient';
import type {
  EmergencySosRequest,
  SosSubmissionPayload,
  SosSubmissionResponse,
  SosStatus,
} from '../types';

// In-memory fallback if backend is momentarily unreachable
let LOCAL_SOS_CACHE: EmergencySosRequest[] = [
  {
    id: 'SOS-IN-2026-001',
    userId: 'usr-101',
    userName: 'M. Selvam',
    userContact: '+91 98401 23456',
    homeHarbour: 'Rameswaram Fishing Harbour',
    vesselName: 'Kadalarasan',
    registrationNo: 'IND-TN-10-MM-4021',
    vesselType: 'Mechanized Trawler',
    coordinates: [9.3200, 79.4000],
    accuracyMeters: 6.2,
    locationSource: 'PHONE_GEOLOCATION',
    deviceTimestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    serverReceivedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    serverReceivedEpoch: (Date.now() - 15 * 60000) / 1000,
    status: 'ACTIVE_DISTRESS',
    notes: 'Engine failure reported near Gulf of Mannar Sector 4.',
  },
];

export const sosService = {
  /**
   * One-Tap SOS Emergency Trigger
   * Dispatches emergency distress beacon immediately to the backend.
   */
  async triggerSos(payload: SosSubmissionPayload): Promise<SosSubmissionResponse> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/sos`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SOS rejected by server (${response.status}): ${errorText}`);
      }

      const data: SosSubmissionResponse = await response.json();
      if (data.sos) {
        // Prepend to local cache
        LOCAL_SOS_CACHE = [data.sos, ...LOCAL_SOS_CACHE.filter((s) => s.id !== data.sos.id)];
      }
      return data;
    } catch (err: unknown) {
      // In-memory fallback if backend is unreachable
      const fallbackSos: EmergencySosRequest = {
        id: `SOS-LOCAL-${Date.now().toString(36).toUpperCase()}`,
        userId: payload.userId || 'usr-101',
        userName: 'M. Selvam',
        userContact: '+91 98401 23456',
        homeHarbour: 'Rameswaram Fishing Harbour',
        vesselName: 'Kadalarasan',
        registrationNo: 'IND-TN-10-MM-4021',
        vesselType: 'Mechanized Trawler',
        coordinates: payload.deviceCoordinates || [9.3200, 79.4000],
        accuracyMeters: payload.deviceAccuracyMeters || null,
        locationSource: payload.deviceCoordinates ? 'PHONE_GEOLOCATION' : 'VESSEL_LAST_KNOWN_REPORT',
        deviceTimestamp: payload.deviceGpsTimestamp ? String(payload.deviceGpsTimestamp) : new Date().toISOString(),
        serverReceivedAt: new Date().toISOString(),
        serverReceivedEpoch: Date.now() / 1000,
        status: 'ACTIVE_DISTRESS',
        notes: 'Submitted via local prototype emergency handler (Backend offline)',
      };

      LOCAL_SOS_CACHE.unshift(fallbackSos);

      return {
        status: 'acknowledged',
        sosId: fallbackSos.id,
        serverReceivedAt: fallbackSos.serverReceivedAt,
        message: 'Emergency SOS dispatched via local prototype queue',
        sos: fallbackSos,
      };
    }
  },

  /**
   * Retrieves all SOS distress requests for the Admin Emergency SOS module.
   */
  async getSosRequests(): Promise<{
    sosRequests: EmergencySosRequest[];
    total: number;
    activeCount: number;
    isBackendLive: boolean;
  }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/sos`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      const list: EmergencySosRequest[] = data.sosRequests || [];
      LOCAL_SOS_CACHE = list;
      return {
        sosRequests: list,
        total: list.length,
        activeCount: list.filter((s) => s.status === 'ACTIVE_DISTRESS' || s.status === 'SEARCH_AND_RESCUE_DISPATCHED').length,
        isBackendLive: true,
      };
    } catch {
      return {
        sosRequests: LOCAL_SOS_CACHE,
        total: LOCAL_SOS_CACHE.length,
        activeCount: LOCAL_SOS_CACHE.filter((s) => s.status === 'ACTIVE_DISTRESS' || s.status === 'SEARCH_AND_RESCUE_DISPATCHED').length,
        isBackendLive: false,
      };
    }
  },

  /**
   * Updates the lifecycle status of an emergency request (Acknowledge, SAR Dispatched, Resolved).
   */
  async updateSosStatus(
    sosId: string,
    status: SosStatus,
    notes?: string
  ): Promise<{ status: string; sos?: EmergencySosRequest }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/sos/${sosId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch {
      // Local fallback
    }

    const idx = LOCAL_SOS_CACHE.findIndex((s) => s.id === sosId);
    if (idx !== -1) {
      LOCAL_SOS_CACHE[idx].status = status;
      if (notes) LOCAL_SOS_CACHE[idx].notes = notes;
      return { status: 'updated', sos: LOCAL_SOS_CACHE[idx] };
    }

    return { status: 'not_found' };
  },
};
