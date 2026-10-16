/**
 * CoastalGuard AI — Isolated GPS Testing Service
 *
 * Provides standalone device GPS location collection using the browser Geolocation API
 * (navigator.geolocation.watchPosition) for testing Admin live vessel tracking
 * without modifying or depending on the Fisherman/User Portal.
 *
 * Telemetry Contract:
 * - vesselId: Target vessel registration/ID
 * - sessionId: Unique tracking session identifier
 * - latitude: Real WGS-84 latitude
 * - longitude: Real WGS-84 longitude
 * - accuracyMeters: Device GPS horizontal accuracy in meters
 * - speedKnots: Speed in knots (converted from m/s if available)
 * - headingDegrees: Compass heading (0-360° if available)
 * - altitudeMeters: Altitude in meters if available
 * - deviceTimestamp: ISO formatted timestamp from device GPS
 * - deviceTimestampMs: Millisecond epoch timestamp from device GPS
 *
 * LIMITATIONS & SAFEGUARDS:
 * 1. Land-Based Test Disclaimer:
 *    Browser GPS collection obtains the physical location of the tester's computer/phone.
 *    Land-based tests reflect the tester's laboratory or office coordinates and must never
 *    be presented as representing an actual maritime fishing craft at sea.
 * 2. Background Tab Suspension:
 *    Modern browsers throttle or suspend navigator.geolocation if the tab is backgrounded,
 *    minimized, or the OS sleeps.
 * 3. Temporary In-Memory Storage:
 *    Transmitted GPS telemetry is cached in FastAPI RAM; data resets when backend restarts.
 */

import { vesselService } from './vesselService';
import type { GpsTelemetryPayload, IngestTelemetryResponse } from '../types';

export type GpsTrackingStatus =
  | 'IDLE'
  | 'REQUESTING_PERMISSION'
  | 'ACTIVE_STREAMING'
  | 'ERROR'
  | 'PERMISSION_DENIED'
  | 'UNSUPPORTED';

export interface GpsTestingState {
  isSupported: boolean;
  isTracking: boolean;
  status: GpsTrackingStatus;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unknown';
  lastCoordinates: [number, number] | null;
  accuracyMeters: number | null;
  speedKnots: number | null;
  headingDegrees: number | null;
  altitudeMeters: number | null;
  deviceTimestamp: string | null;
  deviceTimestampMs: number | null;
  successfulPackets: number;
  lastSuccessfulUpdate: string | null;
  lastServerResponse: IngestTelemetryResponse | null;
  error: string | null;
  targetVesselId: string;
  sessionId: string;
}

export type GpsState = GpsTestingState;
type GpsSubscriber = (state: GpsTestingState) => void;

class GpsTestingService {
  private watchId: number | null = null;
  private subscribers: Set<GpsSubscriber> = new Set();
  private state: GpsTestingState = {
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    isTracking: false,
    status: 'IDLE',
    permissionStatus: 'unknown',
    lastCoordinates: null,
    accuracyMeters: null,
    speedKnots: null,
    headingDegrees: null,
    altitudeMeters: null,
    deviceTimestamp: null,
    deviceTimestampMs: null,
    successfulPackets: 0,
    lastSuccessfulUpdate: null,
    lastServerResponse: null,
    error: null,
    targetVesselId: 'vessel-gps-test',
    sessionId: this.generateSessionId(),
  };

  private generateSessionId(): string {
    return `sess-gps-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  }

  public getState(): GpsTestingState {
    return { ...this.state };
  }

  public subscribe(fn: GpsSubscriber): () => void {
    this.subscribers.add(fn);
    fn(this.getState());
    return () => this.subscribers.delete(fn);
  }

  private notify() {
    const currentState = this.getState();
    this.subscribers.forEach((fn) => {
      try {
        fn(currentState);
      } catch (err) {
        console.error('Error notifying GPS subscriber:', err);
      }
    });
  }

  public setTargetVessel(vesselId: string) {
    this.state.targetVesselId = vesselId;
    this.notify();
  }

  public startTracking(targetVesselId?: string): boolean {
    if (!this.state.isSupported) {
      this.state.status = 'UNSUPPORTED';
      this.state.error = 'Geolocation API is not supported by this browser or environment.';
      this.notify();
      return false;
    }

    if (this.state.isTracking) {
      return true;
    }

    if (targetVesselId) {
      this.state.targetVesselId = targetVesselId;
    }

    this.state.sessionId = this.generateSessionId();
    this.state.isTracking = true;
    this.state.status = 'REQUESTING_PERMISSION';
    this.state.error = null;
    this.state.successfulPackets = 0;
    this.notify();

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    try {
      this.watchId = navigator.geolocation.watchPosition(
        this.handlePositionSuccess.bind(this),
        this.handlePositionError.bind(this),
        options
      );
      return true;
    } catch (err) {
      this.state.isTracking = false;
      this.state.status = 'ERROR';
      this.state.error = err instanceof Error ? err.message : 'Failed to initialize GPS watcher';
      this.notify();
      return false;
    }
  }

  public stopTracking() {
    if (this.watchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.state.isTracking = false;
    this.state.status = 'IDLE';
    this.notify();
  }

  private async handlePositionSuccess(pos: GeolocationPosition) {
    const { latitude, longitude, accuracy, speed, heading, altitude } = pos.coords;

    // Convert speed from m/s to knots if provided and valid
    const speedKnots =
      speed !== null && speed !== undefined && !isNaN(speed) && speed >= 0
        ? Math.round(speed * 1.94384 * 10) / 10
        : null;

    // Heading in degrees (0 - 360) if provided and valid
    const headingDegrees =
      heading !== null && heading !== undefined && !isNaN(heading) && heading >= 0
        ? Math.round(heading)
        : null;

    const altitudeMeters =
      altitude !== null && altitude !== undefined && !isNaN(altitude)
        ? Math.round(altitude * 10) / 10
        : null;

    const deviceEpoch = pos.timestamp || Date.now();
    const deviceIsoString = new Date(deviceEpoch).toISOString();

    const lat = Number(latitude.toFixed(6));
    const lng = Number(longitude.toFixed(6));
    const acc = Math.round(accuracy * 10) / 10;

    this.state.isTracking = true;
    this.state.status = 'ACTIVE_STREAMING';
    this.state.permissionStatus = 'granted';
    this.state.lastCoordinates = [lat, lng];
    this.state.accuracyMeters = acc;
    this.state.speedKnots = speedKnots;
    this.state.headingDegrees = headingDegrees;
    this.state.altitudeMeters = altitudeMeters;
    this.state.deviceTimestamp = deviceIsoString;
    this.state.deviceTimestampMs = deviceEpoch;
    this.state.error = null;

    // Build standard GPS telemetry contract payload
    const payload: GpsTelemetryPayload = {
      vesselId: this.state.targetVesselId,
      sessionId: this.state.sessionId,
      latitude: lat,
      longitude: lng,
      coordinates: [lat, lng],
      accuracyMeters: acc,
      deviceTimestamp: deviceIsoString,
      deviceTimestampMs: deviceEpoch,
      speedKnots,
      headingDegrees,
      altitudeMeters,
      trackingSource: 'LIVE_GPS',
    };

    // Transmit to FastAPI backend ingestion endpoint
    try {
      const response = await vesselService.ingestTelemetry(payload);
      this.state.successfulPackets += 1;
      this.state.lastSuccessfulUpdate = new Date().toLocaleTimeString();
      this.state.lastServerResponse = response;
    } catch (err: unknown) {
      this.state.error = err instanceof Error ? err.message : 'Telemetry transmission failed';
    }

    this.notify();
  }

  private handlePositionError(err: GeolocationPositionError) {
    let msg = 'Unknown GPS error';
    switch (err.code) {
      case err.PERMISSION_DENIED:
        msg = 'Location permission was denied. Please allow location access in your browser settings to test GPS telemetry.';
        this.state.permissionStatus = 'denied';
        this.state.status = 'PERMISSION_DENIED';
        this.stopTracking();
        break;
      case err.POSITION_UNAVAILABLE:
        msg = 'Device location fix is currently unavailable. Ensure your device GPS/Location service is turned on.';
        this.state.status = 'ERROR';
        break;
      case err.TIMEOUT:
        msg = 'GPS fix timed out. Waiting for satellite/cellular location fix...';
        this.state.status = 'ERROR';
        break;
      default:
        this.state.status = 'ERROR';
        break;
    }
    this.state.error = msg;
    this.notify();
  }
}

export const gpsTestingService = new GpsTestingService();
