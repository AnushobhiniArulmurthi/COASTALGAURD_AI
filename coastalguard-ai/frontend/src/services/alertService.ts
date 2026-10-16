import { API_BASE_URL, fetchWithTimeout } from './apiClient';
import { mockAlerts } from '../data/mockData';
import type { SafetyAlert } from '../types';

export interface AlertsResult {
  alerts: SafetyAlert[];
  isBackendLive: boolean;
  timestamp: string;
  error?: string;
}

export const alertService = {
  async getAlerts(): Promise<AlertsResult> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/alerts`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      return {
        alerts: json.alerts || [],
        isBackendLive: true,
        timestamp: json.timestamp || new Date().toISOString(),
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Backend unreachable';
      return {
        alerts: mockAlerts,
        isBackendLive: false,
        timestamp: new Date().toISOString(),
        error: `Could not reach ${API_BASE_URL}/alerts (${message}). Using clearly labelled demonstration data.`,
      };
    }
  },

  async createAlert(alertData: Partial<SafetyAlert>): Promise<{ alert: SafetyAlert; isBackendLive: boolean }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        body: JSON.stringify(alertData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const json = await response.json();
      return {
        alert: json.alert,
        isBackendLive: true,
      };
    } catch {
      // Local fallback in case backend is offline
      const localAlert: SafetyAlert = {
        id: `alert-local-${Date.now()}`,
        title: alertData.title || 'Untitled Advisory',
        titleTamil: alertData.titleTamil || alertData.title,
        message: alertData.message || '',
        messageTamil: alertData.messageTamil || alertData.message,
        coastalRegion: alertData.coastalRegion || 'Gulf of Mannar',
        severity: alertData.severity || 'high',
        issuedAt: 'Just now (Local Demo State)',
        validUntil: alertData.validUntil || 'Next 24 Hours',
        bulletinId: `CG-IN-2026-${Math.floor(100 + Math.random() * 900)}`,
        isActive: true,
        recommendedAction: alertData.recommendedAction || 'Exercise caution.',
        recommendedActionTamil: alertData.recommendedActionTamil,
      };
      return {
        alert: localAlert,
        isBackendLive: false,
      };
    }
  },
};
