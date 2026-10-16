import React, { useState } from 'react';
import {
  AlertTriangle,
  Radio,
  CheckCircle2,
  X,
  RefreshCw,
  MapPin,
  Anchor,
  PhoneCall,
  ShieldAlert
} from 'lucide-react';
import { sosService } from '../../services/sosService';
import type { SosSubmissionPayload, SosSubmissionResponse } from '../../types';

interface OneTapSosButtonProps {
  userId?: string;
  variant?: 'compact' | 'hero' | 'header';
  className?: string;
}

export const OneTapSosButton: React.FC<OneTapSosButtonProps> = ({
  userId = 'usr-101',
  variant = 'header',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState<SosSubmissionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // One-Tap SOS Handler — Zero manual forms required
  const triggerSos = async () => {
    // Prevent accidental duplicate requests while submission is in flight
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    let deviceCoords: [number, number] | null = null;
    let deviceAccuracy: number | null = null;
    let deviceTimestamp: string | null = null;
    let gpsAvailable = false;

    // Attempt high-priority device GPS fix with short timeout
    // NEVER blocks SOS submission if location is disabled or denied
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 3500, // Short timeout so SOS is never delayed
            maximumAge: 5000,
          });
        });

        if (position && position.coords) {
          deviceCoords = [
            Number(position.coords.latitude.toFixed(6)),
            Number(position.coords.longitude.toFixed(6)),
          ];
          deviceAccuracy = Math.round(position.coords.accuracy * 10) / 10;
          deviceTimestamp = new Date(position.timestamp || Date.now()).toISOString();
          gpsAvailable = true;
        }
      } catch {
        // Explicitly continue without blocking. System will indicate missing phone GPS.
        gpsAvailable = false;
      }
    }

    const payload: SosSubmissionPayload = {
      userId,
      deviceCoordinates: deviceCoords,
      deviceAccuracyMeters: deviceAccuracy,
      deviceGpsTimestamp: deviceTimestamp,
      deviceGpsAvailable: gpsAvailable,
    };

    try {
      const response = await sosService.triggerSos(payload);
      setConfirmationData(response);
      setShowModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to transmit SOS. Tap to retry.';
      setErrorMessage(msg);
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. HEADER / COMPACT TRIGGER */}
      {variant === 'header' && (
        <button
          onClick={triggerSos}
          disabled={isSubmitting}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: '2px solid #b91c1c',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: '0 0 12px rgba(220, 38, 38, 0.45)',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
            animation: isSubmitting ? 'none' : 'sos-beacon-pulse 2s infinite',
          }}
          title="One-Tap Emergency Distress Beacon"
        >
          {isSubmitting ? (
            <RefreshCw size={15} className="animate-spin" />
          ) : (
            <Radio size={16} />
          )}
          <span>{isSubmitting ? 'SENDING SOS...' : '🆘 ONE-TAP SOS'}</span>
        </button>
      )}

      {/* 2. HERO / DASHBOARD TRIGGER */}
      {variant === 'hero' && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '2px solid #f87171',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 14px rgba(220, 38, 38, 0.5)',
              }}
            >
              <ShieldAlert size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                  Immediate Marine Emergency (அவசர உதவி)
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    border: '1px solid #fca5a5',
                  }}
                >
                  One-Tap Only • No Form Filling
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: '4px 0 0' }}>
                Instant single-tap distress beacon. Automatically dispatches your registered identity, vessel credentials, and GPS coordinates to Indian Coast Guard SAR.
              </p>
            </div>
          </div>

          <button
            onClick={triggerSos}
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.75rem 1.6rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: '2px solid #991b1b',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                <span>Broadcasting Distress Beacon...</span>
              </>
            ) : (
              <>
                <Radio size={20} />
                <span>TRIGGER EMERGENCY SOS</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 3. CONCISE SUBMISSION CONFIRMATION / ERROR MODAL */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(7, 19, 34, 0.75)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
        >
          <div
            className="card-base"
            style={{
              maxWidth: '540px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
              border: confirmationData ? '2px solid #16a34a' : '2px solid #dc2626',
            }}
          >
            {/* Success State */}
            {confirmationData && (
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        backgroundColor: '#dcfce7',
                        color: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={26} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-navy-primary)', margin: 0 }}>
                        🚨 Emergency SOS Dispatched!
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>
                        Beacon Reference: {confirmationData.sosId}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-4)',
                    marginBottom: 'var(--space-4)',
                    fontSize: '0.85rem',
                    color: '#166534',
                    lineHeight: 1.5,
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    Maritime Rescue Coordination Centre (MRCC) has received your emergency alert. CoastalGuard command has your registered details on file.
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '6px' }}>
                    தமிழ்: உங்கள் அவசர உதவி கோரிக்கை கடலோர காவல்படை கட்டுப்பாட்டு அறைக்கு அனுப்பப்பட்டது.
                  </div>
                </div>

                {/* Collected Information Overview (Transparency) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', marginBottom: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Anchor size={14} /> Registered Vessel:
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                      {confirmationData.sos?.vesselName || 'Kadalarasan'} ({confirmationData.sos?.registrationNo || 'IND-TN-10-MM-4021'})
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PhoneCall size={14} /> Skipper / Contact:
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {confirmationData.sos?.userName || 'M. Selvam'} • {confirmationData.sos?.userContact || '+91 98401 23456'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> Distress Location:
                    </span>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace', color: confirmationData.sos?.coordinates ? '#0369a1' : '#b45309' }}>
                      {confirmationData.sos?.coordinates
                        ? `${confirmationData.sos.coordinates[0].toFixed(4)}°N, ${confirmationData.sos.coordinates[1].toFixed(4)}°E`
                        : 'Harbour Registry Assigned (Phone GPS Unavailable)'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Server Acknowledged:</span>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                      {confirmationData.serverReceivedAt || new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Understood (சரி, மூடுக)
                  </button>
                </div>
              </div>
            )}

            {/* Error / Retry State */}
            {errorMessage && !confirmationData && (
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <AlertTriangle size={26} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                        SOS Transmission Failed
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#b91c1c', margin: '2px 0 0' }}>
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    marginBottom: 'var(--space-4)',
                    fontSize: '0.825rem',
                    color: '#92400e',
                  }}
                >
                  If cellular internet is down, tune your on-board wireless transceiver to <strong>VHF Emergency Channel 16</strong> or call Coast Guard Helpline <strong>1554</strong> immediately.
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button
                    onClick={triggerSos}
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ flex: 1, backgroundColor: '#dc2626', borderColor: '#b91c1c', justifyContent: 'center' }}
                  >
                    <RefreshCw size={16} className={isSubmitting ? 'animate-spin' : ''} />
                    <span>{isSubmitting ? 'Retrying...' : 'Retry SOS Submission'}</span>
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pulse keyframe animation */}
      <style>{`
        @keyframes sos-beacon-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.6);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
          }
        }
      `}</style>
    </>
  );
};
