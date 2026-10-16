import { API_BASE_URL, fetchWithTimeout } from './apiClient';
import { mockMarineConditions } from '../data/mockData';
import type { MarineCondition } from '../types';

export interface MarineResult {
  conditions: Record<string, MarineCondition>;
  isBackendLive: boolean;
  timestamp: string;
  error?: string;
}

export const marineService = {
  async getMarineConditions(): Promise<MarineResult> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/marine-conditions`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      return {
        conditions: json.conditions || {},
        isBackendLive: true,
        timestamp: json.timestamp || new Date().toISOString(),
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Backend unreachable';
      return {
        conditions: mockMarineConditions,
        isBackendLive: false,
        timestamp: new Date().toISOString(),
        error: `Could not reach ${API_BASE_URL}/marine-conditions (${message}). Using clearly labelled demonstration data.`,
      };
    }
  },

  async getMarineCondition(regionId: string): Promise<{ condition: MarineCondition; isBackendLive: boolean }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/marine-conditions/${regionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const json = await response.json();
      return {
        condition: json.condition,
        isBackendLive: true,
      };
    } catch {
      const fallback = mockMarineConditions[regionId] || mockMarineConditions['gulf-of-mannar'];
      return {
        condition: fallback,
        isBackendLive: false,
      };
    }
  },
};
