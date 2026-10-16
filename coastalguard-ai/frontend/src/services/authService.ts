/**
 * CoastalGuard AI — Fisherman Authentication & Registration Service
 * Coordinates client interaction with FastAPI /api/auth endpoints,
 * manages session bearer tokens, and synchronizes profile state.
 */

import { apiRequest, ApiError } from './api';

export interface FishermanRegisterPayload {
  fullName: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  vesselName?: string;
  registrationNo?: string;
  homeHarbour?: string;
  preferredLanguage?: 'en' | 'ta';
}

export interface FishermanUser {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  role: 'fisherman';
  vesselName: string;
  registrationNo: string;
  homeHarbour: string;
  preferredLanguage: string;
  createdAt: string;
  isVerified: boolean;
}

export interface FishermanRegisterResponse {
  status: 'success' | 'error';
  message: string;
  user: FishermanUser;
  accessToken: string;
  tokenType: string;
  databasePersistence: string;
  requiresEmailVerification: boolean;
  instructions?: string;
}

export interface FishermanLoginResponse {
  status: 'success' | 'error';
  message: string;
  user: FishermanUser;
  accessToken: string;
  tokenType: string;
  role: 'fisherman';
}

const TOKEN_KEY = 'cg_auth_token';
const USER_KEY = 'cg_fisherman_user';

// Default seeded demo fisherman
const DEFAULT_DEMO_USER: FishermanUser = {
  id: 'usr-101',
  fullName: 'M. Selvam (செல்வம்)',
  mobileNumber: '+91 98401 23456',
  email: 'selvam.fisher@demo-mail.com',
  role: 'fisherman',
  vesselName: 'Kadalarasan (கடலரசன்)',
  registrationNo: 'IND-TN-10-MM-4021',
  homeHarbour: 'Rameswaram Fishing Harbour',
  preferredLanguage: 'ta',
  createdAt: '2026-10-15T00:00:00.000Z',
  isVerified: true,
};

class AuthService {
  /**
   * Register a new fisherman account.
   * Calls FastAPI /api/auth/register with server-side PBKDF2 hashing and role enforcement.
   */
  async registerFisherman(payload: FishermanRegisterPayload): Promise<FishermanRegisterResponse> {
    try {
      const response = await apiRequest<FishermanRegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: payload.fullName.trim(),
          mobileNumber: payload.mobileNumber.trim(),
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
          confirmPassword: payload.confirmPassword,
          vesselName: payload.vesselName?.trim() || 'Traditional Craft',
          registrationNo: payload.registrationNo?.trim() || 'PENDING-REG',
          homeHarbour: payload.homeHarbour?.trim() || 'Rameswaram Fishing Harbour',
          preferredLanguage: payload.preferredLanguage || 'en',
        }),
      });

      if (response && response.user) {
        this.saveSession(response.accessToken, response.user);
      }

      return response;
    } catch (error: any) {
      // If backend is unavailable (e.g. running in frontend-only prototype mode)
      if (error instanceof ApiError && error.errorCode === 'BACKEND_UNAVAILABLE') {
        return this.registerOfflineFallback(payload);
      }
      throw error;
    }
  }

  /**
   * Log into the Fisherman Portal.
   */
  async loginFisherman(
    identifier: string,
    pass: string,
    rememberMe = true
  ): Promise<FishermanLoginResponse> {
    try {
      const response = await apiRequest<FishermanLoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: pass,
          rememberMe,
        }),
      });

      if (response && response.user) {
        this.saveSession(response.accessToken, response.user);
      }

      return response;
    } catch (error: any) {
      if (error instanceof ApiError && error.errorCode === 'BACKEND_UNAVAILABLE') {
        return this.loginOfflineFallback(identifier, pass);
      }
      throw error;
    }
  }

  /**
   * Retrieve active session user from localStorage or return default demo user.
   */
  getCurrentUser(): FishermanUser {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // LocalStorage access error
    }
    return DEFAULT_DEMO_USER;
  }

  /**
   * Retrieve active Bearer token if present.
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Terminate active fisherman session.
   */
  logout(): void {
    try {
      const token = this.getToken();
      if (token) {
        // Fire-and-forget logout request to backend
        apiRequest('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // LocalStorage access error
    }
  }

  /**
   * Persist session credentials in client storage.
   */
  private saveSession(token: string, user: FishermanUser): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // Storage quota or privacy restriction
    }
  }

  /**
   * Resilient offline prototype fallback when Python FastAPI backend is not running.
   */
  private registerOfflineFallback(payload: FishermanRegisterPayload): FishermanRegisterResponse {
    const cleanPhone = payload.mobileNumber.replace(/\D/g, '').slice(-10);
    const existing = this.getCurrentUser();

    if (existing && existing.id !== 'usr-101') {
      const existingDigits = existing.mobileNumber.replace(/\D/g, '').slice(-10);
      if (existingDigits === cleanPhone) {
        throw new ApiError(
          409,
          'An account with this mobile number is already registered. Please log in instead.',
          'DUPLICATE_MOBILE'
        );
      }
      if (existing.email.toLowerCase() === payload.email.trim().toLowerCase()) {
        throw new ApiError(
          409,
          'An account with this email address is already registered. Please log in instead.',
          'DUPLICATE_EMAIL'
        );
      }
    }

    const newUser: FishermanUser = {
      id: `usr-fisher-${Date.now()}`,
      fullName: payload.fullName.trim(),
      mobileNumber: payload.mobileNumber.trim(),
      email: payload.email.trim().toLowerCase(),
      role: 'fisherman',
      vesselName: payload.vesselName?.trim() || 'Traditional Craft',
      registrationNo: payload.registrationNo?.trim() || 'PENDING-REG',
      homeHarbour: payload.homeHarbour?.trim() || 'Rameswaram Fishing Harbour',
      preferredLanguage: payload.preferredLanguage || 'en',
      createdAt: new Date().toISOString(),
      isVerified: true,
    };

    const token = `cg_session_proto_${Math.random().toString(36).substring(2, 15)}`;
    this.saveSession(token, newUser);

    return {
      status: 'success',
      message:
        payload.preferredLanguage === 'ta'
          ? `வணக்கம் ${newUser.fullName}! உங்கள் மீனவர் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது.`
          : `Welcome ${newUser.fullName}! Your fisherman account has been created successfully.`,
      user: newUser,
      accessToken: token,
      tokenType: 'Bearer',
      databasePersistence: 'persisted_in_memory_auth_store (Prototype offline mode)',
      requiresEmailVerification: false,
      instructions: 'Your fisherman profile is registered and active. You can immediately access the Fisherman Portal.',
    };
  }

  private loginOfflineFallback(identifier: string, _pass: string): FishermanLoginResponse {
    const cleanId = identifier.trim();
    const cleanDigits = cleanId.replace(/\D/g, '').slice(-10);
    const storedUser = this.getCurrentUser();

    const storedDigits = storedUser.mobileNumber.replace(/\D/g, '').slice(-10);
    const isStoredMatch =
      (cleanDigits && storedDigits === cleanDigits) ||
      storedUser.email.toLowerCase() === cleanId.toLowerCase() ||
      storedUser.mobileNumber === cleanId;

    if (isStoredMatch) {
      const token = `cg_session_proto_${Math.random().toString(36).substring(2, 15)}`;
      this.saveSession(token, storedUser);
      return {
        status: 'success',
        message: 'Authentication successful (Prototype local session).',
        user: storedUser,
        accessToken: token,
        tokenType: 'Bearer',
        role: 'fisherman',
      };
    }

    // Default demo fallback credentials
    if (cleanDigits === '9840123456' || cleanId.toLowerCase() === 'selvam.fisher@demo-mail.com') {
      const token = `cg_session_proto_${Math.random().toString(36).substring(2, 15)}`;
      this.saveSession(token, DEFAULT_DEMO_USER);
      return {
        status: 'success',
        message: 'Demo fisherman login successful.',
        user: DEFAULT_DEMO_USER,
        accessToken: token,
        tokenType: 'Bearer',
        role: 'fisherman',
      };
    }

    throw new ApiError(
      401,
      'Invalid mobile number, email, or password. Please verify your credentials or sign up for a new account.',
      'INVALID_CREDENTIALS'
    );
  }
}

export const authService = new AuthService();
export default authService;
