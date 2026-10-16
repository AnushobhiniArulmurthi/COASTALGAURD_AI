import { API_BASE_URL, fetchWithTimeout } from './apiClient';
import { mockVessels } from '../data/mockData';
import type { VesselReport } from '../types';

export interface VesselsResult {
  vessels: VesselReport[];
  isBackendLive: boolean;
  timestamp: string;
  provider?: string;
  isLiveProviderActive?: boolean;
  error?: string;
}

export const vesselService = {
  async getVessels(): Promise<VesselsResult> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/vessels`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      return {
        vessels: json.vessels || [],
        isBackendLive: true,
        timestamp: json.timestamp || new Date().toISOString(),
        provider: json.provider,
        isLiveProviderActive: json.isLiveProviderActive,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Backend unreachable';
      return {
        vessels: mockVessels,
        isBackendLive: false,
        timestamp: new Date().toISOString(),
        provider: 'simulated',
        isLiveProviderActive: false,
        error: `Could not reach ${API_BASE_URL}/vessels (${message}). Using clearly labelled demonstration data.`,
      };
    }
  },

  async getVesselById(id: string): Promise<{ vessel: VesselReport | null; isBackendLive: boolean; error?: string }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/vessels/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const json = await response.json();
      return {
        vessel: json.vessel || null,
        isBackendLive: true,
      };
    } catch (err: unknown) {
      const fallback = mockVessels.find(v => v.id === id) || null;
      return {
        vessel: fallback,
        isBackendLive: false,
        error: err instanceof Error ? err.message : 'Backend unreachable',
      };
    }
  },

  async ingestTelemetry(payload: import('../types').GpsTelemetryPayload): Promise<import('../types').IngestTelemetryResponse> {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/vessels/telemetry/ingest`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Telemetry ingest rejected (${response.status}): ${errorText}`);
    }

    return response.json();
  },

  async getLatestTelemetry(vesselId: string): Promise<any> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/api/vessels/telemetry/latest/${vesselId}`);
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  },
};
