import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AlertTriangle,
  LifeBuoy,
  X,
  Radio,
  PhoneCall,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Navigation,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  submitSosAlert,
  type SOSCoordinates,
  type SOSIncidentResponse,
} from '../../services/sosService';

interface SosEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStage = 'countdown' | 'submitting' | 'received' | 'error';

export const SosEmergencyModal: React.FC<SosEmergencyModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [stage, setStage] = useState<ModalStage>('countdown');
  const [countdown, setCountdown] = useState<number>(5);
  const [deviceLocation, setDeviceLocation] = useState<SOSCoordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<'pending' | 'acquired' | 'unavailable'>('pending');
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [incidentData, setIncidentData] = useState<SOSIncidentResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submissionLockedRef = useRef<boolean>(false);

  // Generate a cryptographically distinct idempotency key per countdown session
  const generateIdempotencyKey = () => {
    const timestamp = Date.now();
    const randomBits = Math.random().toString(36).substring(2, 10);
    return `sos-client-${timestamp}-${randomBits}`;
  };

  // Immediate Cancel Handler: stops countdown, clears timers, closes overlay
  const handleCancel = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    submissionLockedRef.current = true;
    onClose();
  }, [onClose]);

  // Listen for Escape key to cancel countdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (stage === 'countdown' || stage === 'error' || stage === 'received') {
          handleCancel();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, stage, handleCancel]);

  // Initialize fresh countdown every time modal opens
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Reset all state for a brand new emergency session
    setStage('countdown');
    setCountdown(5);
    setIncidentData(null);
    setErrorMessage('');
    submissionLockedRef.current = false;
    const newKey = generateIdempotencyKey();
    setIdempotencyKey(newKey);

    // Acquire device GPS location non-blockingly
    setLocationStatus('pending');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDeviceLocation({
            latitude: Number(pos.coords.latitude.toFixed(6)),
            longitude: Number(pos.coords.longitude.toFixed(6)),
            accuracyMeters: Math.round(pos.coords.accuracy),
          });
          setLocationStatus('acquired');
        },
        () => {
          setDeviceLocation(null);
          setLocationStatus('unavailable');
        },
        { enableHighAccuracy: true, timeout: 3500, maximumAge: 60000 }
      );
    } else {
      setLocationStatus('unavailable');
    }

    // Start 5-second countdown timer
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  // Execute SOS Submission function (called on countdown reaching 0 or on Retry)
  const executeSubmission = useCallback(
    async (keyToUse: string, locationToUse: SOSCoordinates | null) => {
      setStage('submitting');
      setErrorMessage('');

      try {
        const response = await submitSosAlert({
          idempotencyKey: keyToUse,
          deviceCoordinates: locationToUse,
          language,
        });

        setIncidentData(response);
        setStage('received');
      } catch (err: any) {
        console.error('SOS transmission failed:', err);
        setErrorMessage(
          err.message ||
            (isTamil
              ? 'அவசர எச்சரிக்கையை சர்வரில் சமர்ப்பிக்க முடியவில்லை. நெட்வொர்க் இணைப்பைச் சரிபார்க்கவும்.'
              : 'Failed to deliver emergency SOS alert to the backend server. Please verify network.')
        );
        setStage('error');
      }
    },
    [language, isTamil]
  );

  // Trigger submission exactly once when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && stage === 'countdown' && !submissionLockedRef.current) {
      submissionLockedRef.current = true;
      executeSubmission(idempotencyKey, deviceLocation);
    }
  }, [countdown, stage, idempotencyKey, deviceLocation, executeSubmission]);

  // Retry handler re-uses the EXACT same idempotencyKey to prevent duplicate incidents
  const handleRetry = () => {
    if (stage === 'submitting') return;
    executeSubmission(idempotencyKey, deviceLocation);
  };

  if (!isOpen) return null;

  // Circular ring calculations for 5-second countdown
  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circumference - (countdown / 5) * circumference;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-dialog-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(5, 12, 20, 0.94)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      <div
        className="sos-card-container"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#091522',
          border: '2px solid #ef4444',
          borderRadius: 'var(--radius-xl, 16px)',
          boxShadow: '0 0 60px rgba(239, 68, 68, 0.4), 0 20px 40px rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Top Emergency Beacon Bar */}
        <div
          style={{
            backgroundColor: '#dc2626',
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #b91c1c',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <LifeBuoy size={22} className="animate-pulse" color="#ffffff" />
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#ffffff',
              }}
            >
              CoastalGuard AI • {isTamil ? 'அவசர SOS பாதுகாப்பு' : 'Maritime Distress Safety'}
            </span>
          </div>

          {(stage === 'countdown' || stage === 'received' || stage === 'error') && (
            <button
              onClick={handleCancel}
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: 'none',
                color: '#ffffff',
                padding: '4px',
                borderRadius: 'var(--radius-full, 9999px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={t('sos.closeModal')}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* ============================================================ */}
          {/* STAGE 1: DRAMATIC 5-SECOND COUNTDOWN                         */}
          {/* ============================================================ */}
          {stage === 'countdown' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full, 9999px)',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                <AlertTriangle size={15} color="#ef4444" />
                <span>{t('sos.activatingTitle')}</span>
              </div>

              {/* Animated Countdown Circle Ring */}
              <div style={{ position: 'relative', width: 170, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="170" height="170" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="85"
                    cy="85"
                    r={circleRadius}
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="10"
                  />
                  <circle
                    cx="85"
                    cy="85"
                    r={circleRadius}
                    fill="transparent"
                    stroke="#ef4444"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.95s linear' }}
                  />
                </svg>

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '4.5rem',
                      fontWeight: 900,
                      lineHeight: 1,
                      color: '#ffffff',
                      textShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
                    }}
                  >
                    {countdown}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                    {t('sos.secondsRemaining')}
                  </span>
                </div>
              </div>

              {/* Warning Text */}
              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#e2e8f0',
                  lineHeight: 1.5,
                  maxWidth: '440px',
                  margin: 0,
                }}
              >
                {t('sos.activatingDesc')}
              </p>

              {/* GPS Acquisition Status Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.78rem',
                  color: locationStatus === 'acquired' ? '#34d399' : '#94a3b8',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid #1e293b',
                }}
              >
                <Navigation size={14} />
                <span>
                  {locationStatus === 'acquired'
                    ? `${t('sos.deviceGps')}: ${deviceLocation?.latitude}°, ${deviceLocation?.longitude}°`
                    : locationStatus === 'pending'
                    ? isTamil
                      ? 'சாதன ஜிபிஎஸ் இருப்பிடம் கண்டறியப்படுகிறது...'
                      : 'Acquiring device GPS coordinates...'
                    : t('sos.locationUnavailable')}
                </span>
              </div>

              {/* Highly Visible Cancel Button */}
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  borderRadius: 'var(--radius-md, 8px)',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: '2px solid #ffffff',
                  fontSize: '1rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 255, 255, 0.25)',
                  transition: 'all 0.15s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                className="btn-cancel-sos"
              >
                <X size={20} />
                <span>{t('sos.cancel')}</span>
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 2: SUBMITTING / CONNECTING TO BACKEND                  */}
          {/* ============================================================ */}
          {stage === 'submitting' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1rem', gap: '1.25rem' }}>
              <Loader2 size={48} className="animate-spin" color="#ef4444" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                  {t('sos.submitting')}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                  {isTamil
                    ? 'CoastalGuard AI பின்தளத்துடன் அவசர சிக்னல் இணைக்கப்படுகிறது...'
                    : 'Transmitting encrypted distress payload to FastAPI backend service...'}
                </p>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 3: SOS REQUEST RECEIVED (CONFIRMED BACKEND ACK)         */}
          {/* ============================================================ */}
          {stage === 'received' && incidentData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md, 8px)' }}>
                <CheckCircle2 size={26} color="#10b981" style={{ flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', margin: 0 }}>
                    {t('sos.receivedTitle')}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#a7f3d0', margin: '2px 0 0 0' }}>
                    {t('sos.receivedDesc')}
                  </p>
                </div>
              </div>

              {/* Incident Reference Card */}
              <div style={{ backgroundColor: '#0c1b2c', border: '1px solid #1a3652', borderRadius: 'var(--radius-md, 8px)', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a3652', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#94a3b8' }}>{t('sos.incidentRef')}:</span>
                  <span style={{ color: '#ffffff', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                    {incidentData.incidentId}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a3652', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#94a3b8' }}>{t('sos.timeConfirmed')}:</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
                    {new Date(incidentData.timestamp).toLocaleString(language === 'ta' ? 'ta-IN' : 'en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a3652', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#94a3b8' }}>{t('sos.fishermanDetails')}:</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
                    {incidentData.fisherman.name} • {incidentData.fisherman.vesselName} ({incidentData.fisherman.registrationNo})
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>{t('sos.deviceGps')}:</span>
                  <span style={{ color: incidentData.deviceLocation ? '#34d399' : '#f87171', fontWeight: 600 }}>
                    {incidentData.deviceLocation
                      ? `${incidentData.deviceLocation.latitude}°, ${incidentData.deviceLocation.longitude}° (±${incidentData.deviceLocation.accuracyMeters || 10}m)`
                      : t('sos.locationUnavailable')}
                  </span>
                </div>
              </div>

              {/* Critical Safety Prototype Notice */}
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.75rem', borderRadius: 'var(--radius-md, 8px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <AlertTriangle size={14} />
                  <span>{t('sos.disclaimerTitle')}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#fca5a5', lineHeight: 1.45, margin: 0 }}>
                  {t('sos.disclaimerText')}
                </p>
              </div>

              {/* Official Emergency Contact Directory */}
              <div style={{ backgroundColor: '#091c2e', border: '1px solid #1e3a5f', padding: '0.75rem', borderRadius: 'var(--radius-md, 8px)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Radio size={14} />
                  <span>{t('sos.officialChannels')}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '0.4rem 0.5rem', borderRadius: '4px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>{t('sos.vhfEmergency')}</div>
                    <div style={{ color: '#ffffff', fontWeight: 700 }}>VHF Ch 16</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '0.4rem 0.5rem', borderRadius: '4px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>{t('sos.coastGuardHelpline')}</div>
                    <div style={{ color: '#ffffff', fontWeight: 700 }}>1554 (Toll-Free)</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '0.4rem 0.5rem', borderRadius: '4px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>{t('sos.marinePolice')}</div>
                    <div style={{ color: '#ffffff', fontWeight: 700 }}>1093</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '0.4rem 0.5rem', borderRadius: '4px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>{t('sos.nationalEmergency')}</div>
                    <div style={{ color: '#ffffff', fontWeight: 700 }}>112</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: 'var(--radius-md, 8px)',
                  backgroundColor: 'var(--color-teal, #0d9488)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '0.25rem',
                }}
              >
                {t('sos.closeModal')}
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* STAGE 4: TRANSMISSION ERROR & SAFE RETRY                     */}
          {/* ============================================================ */}
          {stage === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md, 8px)' }}>
                <AlertTriangle size={26} color="#ef4444" style={{ flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f87171', margin: 0 }}>
                    {t('sos.failedTitle')}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#fca5a5', margin: '2px 0 0 0' }}>
                    {errorMessage || t('sos.failedDesc')}
                  </p>
                </div>
              </div>

              {/* Direct Emergency Channels - always available even during offline/error */}
              <div style={{ backgroundColor: '#091c2e', border: '1px solid #ef4444', padding: '0.85rem', borderRadius: 'var(--radius-md, 8px)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fca5a5', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PhoneCall size={16} />
                  <span>{t('sos.officialChannels')}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.45rem 0.6rem', borderRadius: '4px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{t('sos.vhfEmergency')}</div>
                    <div style={{ color: '#ffffff', fontWeight: 700 }}>VHF Ch 16 (MAYDAY)</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.45rem 0.6rem', borderRadius: '4px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{t('sos.coastGuardHelpline')}</div>
                    <div style={{ color: '#ffffff', fontWeight: 700 }}>1554</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Retry & Close */}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={handleRetry}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md, 8px)',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: '1px solid #ef4444',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={16} />
                  <span>{t('sos.retry')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: 'var(--radius-md, 8px)',
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    border: '1px solid #334155',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {t('fisherman.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SosEmergencyModal;
