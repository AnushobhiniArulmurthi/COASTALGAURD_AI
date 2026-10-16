import { API_BASE_URL, fetchWithTimeout } from './apiClient';
import { mockUsers } from '../data/mockData';
import type { FishermanUser, UserStatus } from '../types';

export interface UsersResult {
  users: FishermanUser[];
  isBackendLive: boolean;
  timestamp: string;
  error?: string;
}

export const userService = {
  async getUsers(): Promise<UsersResult> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      return {
        users: json.users || [],
        isBackendLive: true,
        timestamp: json.timestamp || new Date().toISOString(),
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Backend unreachable';
      return {
        users: mockUsers,
        isBackendLive: false,
        timestamp: new Date().toISOString(),
        error: `Could not reach ${API_BASE_URL}/users (${message}). Using clearly labelled demonstration data.`,
      };
    }
  },

  async updateUserStatus(id: string, newStatus?: UserStatus): Promise<{ user: FishermanUser | null; isBackendLive: boolean }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ accountStatus: newStatus }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const json = await response.json();
      return {
        user: json.user,
        isBackendLive: true,
      };
    } catch {
      return {
        user: null,
        isBackendLive: false,
      };
    }
  },
};
