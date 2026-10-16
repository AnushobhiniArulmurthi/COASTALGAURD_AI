/**
 * CoastalGuard AI — Base API Configuration & Request Client
 */

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/+$/, '');

export interface ApiErrorDetail {
  status: string;
  errorCode: string;
  message: string;
  suggestedAction?: string;
  detail?: string;
}

export class ApiError extends Error {
  statusCode: number;
  errorCode: string;
  suggestedAction?: string;

  constructor(statusCode: number, message: string, errorCode = 'API_ERROR', suggestedAction?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.suggestedAction = suggestedAction;
  }
}

/**
 * Standard fetch helper with timeout and JSON error normalization.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = 25000
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    // Parse response body
    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Extract structured error from FastAPI HTTPException details if available
      const detail = data?.detail;
      let errorMessage = 'An error occurred while communicating with the server.';
      let errorCode = `HTTP_${response.status}`;
      let suggestedAction: string | undefined;

      if (typeof detail === 'object' && detail !== null) {
        errorMessage = detail.message || detail.detail || errorMessage;
        errorCode = detail.errorCode || errorCode;
        suggestedAction = detail.suggestedAction;
      } else if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      }

      throw new ApiError(response.status, errorMessage, errorCode, suggestedAction);
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError(
        408,
        'The request timed out. The AI service took too long to respond.',
        'REQUEST_TIMEOUT',
        'Please check your internet connection and try asking a shorter question.'
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }

    // Network error (e.g. FastAPI server is not running on port 8000)
    throw new ApiError(
      0,
      'Unable to connect to the CoastalGuard AI backend service.',
      'BACKEND_UNAVAILABLE',
      'Ensure the Python FastAPI server is running on http://127.0.0.1:8000 (uvicorn app.main:app --reload).'
    );
  }
}
