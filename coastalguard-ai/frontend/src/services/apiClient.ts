/**
 * CoastalGuard AI — Base HTTP Client
 *
 * Configured with timeout handling, CORS headers, and internal error recovery.
 * Backend connectivity status is kept internal and never rendered to the UI.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const TIMEOUT_MS = 3500;

export interface ApiResponse<T> {
  data: T;
  isBackendLive: boolean;
  error?: string;
}

export async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function checkBackendConnection(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/health`);
    if (res.ok) {
      const data = await res.json();
      return data.status === 'online' || data.status === 'ok';
    }
    return false;
  } catch {
    return false;
  }
}

export { API_BASE_URL };
