import React, { useState, useEffect, useCallback } from 'react';
import {
  Radio,
  MapPin,
  Phone,
  Anchor,
  User,
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  LifeBuoy,
  CheckCircle
} from 'lucide-react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { sosService } from '../../../services/sosService';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import type { EmergencySosRequest, SosStatus } from '../../../types';

export const EmergencySosManagement: React.FC = () => {
  const { t } = useAdminLanguage();
  const [sosRequests, setSosRequests] = useState<EmergencySosRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSosData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const result = await sosService.getSosRequests();
      setSosRequests(result.sosRequests);
    } catch {
      // Internal error handled without intrusive banners
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSosData();
    // Continuous real-time auto-poll every 3.5 seconds
    const interval = setInterval(() => {
      fetchSosData(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [fetchSosData]);

  const handleUpdateStatus = async (sosId: string, newStatus: SosStatus) => {
    setUpdatingId(sosId);
    try {
      await sosService.updateSosStatus(sosId, newStatus);
      setSosRequests((prev) =>
        prev.map((s) => (s.id === sosId ? { ...s, status: newStatus } : s))
      );
      setToastMessage(`Distress Beacon ${sosId} updated to ${newStatus.replace(/_/g, ' ')}`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch {
      // Ignored
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = sosRequests.filter((s) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return s.status === 'ACTIVE_DISTRESS' || s.status === 'SEARCH_AND_RESCUE_DISPATCHED';
    if (filterStatus === 'resolved') return s.status === 'RESOLVED';
    return s.status === filterStatus;
  });

  const activeCount = sosRequests.filter(
    (s) => s.status === 'ACTIVE_DISTRESS' || s.status === 'SEARCH_AND_RESCUE_DISPATCHED'
  ).length;

  return (
    <AdminLayout>
      <PageHeader
        title={t('sos.title', 'Emergency SOS Distress Management')}
        subtitle={t('sos.subtitle', 'Live maritime distress telemetry, single-tap fisherman beacons, and search-and-rescue dispatch.')}
        badge={activeCount > 0 ? `🚨 ${activeCount} Active Emergencies` : 'MRCC Live Standby'}
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <button
              onClick={() => fetchSosData(false)}
              disabled={isRefreshing}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
              title="Refresh emergency feed"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Checking...' : 'Refresh Feed'}</span>
            </button>
          </div>
        }
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            color: '#166534',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Distress Metric Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div
          className="card-base"
          style={{
            padding: 'var(--space-4)',
            backgroundColor: activeCount > 0 ? '#fef2f2' : '#ffffff',
            border: activeCount > 0 ? '1.5px solid #f87171' : '1px solid var(--color-border-light)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: activeCount > 0 ? '#b91c1c' : '#64748b', textTransform: 'uppercase' }}>
            Active Distress Alerts
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: activeCount > 0 ? '#dc2626' : 'var(--color-navy-primary)', marginTop: '2px' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Immediate SAR action required
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Total Beacons (Session)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy-primary)', marginTop: '2px' }}>
            {sosRequests.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Cumulative emergencies recorded
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Emergency Protocol
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0369a1', marginTop: '4px' }}>
            VHF Ch 16 & 68
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Coast Guard MRCC Toll-Free: 1554
          </div>
        </div>
      </div>

      {/* Filter Bar & Header */}
      <div
        className="card-base"
        style={{
          padding: 'var(--space-4) var(--space-5)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Radio size={18} color="var(--color-danger)" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-navy-primary)' }}>
            Distress Beacons Queue ({filteredRequests.length})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-navy-primary)',
            }}
          >
            <option value="all">All Distress Alerts</option>
            <option value="active">Active Only</option>
            <option value="ACTIVE_DISTRESS">Distress Pending</option>
            <option value="SEARCH_AND_RESCUE_DISPATCHED">SAR Dispatched</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Distress Cards List */}
      {isLoading && (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto var(--space-2)' }} />
          <div>Loading emergency distress queue...</div>
        </div>
      )}

      {!isLoading && filteredRequests.length === 0 && (
        <div className="card-base" style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#64748b' }}>
          <LifeBuoy size={36} color="#94a3b8" style={{ margin: '0 auto var(--space-2)' }} />
          <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)', fontSize: '1rem' }}>
            No Active Distress Signals
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            All registered Tamil Nadu coastal sectors report safe voyages. Incoming One-Tap SOS alerts will appear here automatically in real time.
          </p>
        </div>
      )}

      {!isLoading && filteredRequests.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          {filteredRequests.map((sos) => {
            const isDistress = sos.status === 'ACTIVE_DISTRESS' || sos.status === 'SEARCH_AND_RESCUE_DISPATCHED';

            return (
              <div
                key={sos.id}
                className="card-base"
                style={{
                  padding: 'var(--space-5)',
                  borderLeft: `5px solid ${isDistress ? '#dc2626' : '#16a34a'}`,
                  backgroundColor: isDistress ? '#ffffff' : '#fafafa',
                  boxShadow: isDistress ? '0 4px 14px rgba(220, 38, 38, 0.12)' : 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: isDistress ? '#991b1b' : 'var(--color-navy-primary)' }}>
                        🚨 {sos.id}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor:
                            sos.status === 'ACTIVE_DISTRESS'
                              ? '#fee2e2'
                              : sos.status === 'SEARCH_AND_RESCUE_DISPATCHED'
                              ? '#e0f2fe'
                              : sos.status === 'RESOLVED'
                              ? '#dcfce7'
                              : '#fef3c7',
                          color:
                            sos.status === 'ACTIVE_DISTRESS'
                              ? '#b91c1c'
                              : sos.status === 'SEARCH_AND_RESCUE_DISPATCHED'
                              ? '#0369a1'
                              : sos.status === 'RESOLVED'
                              ? '#15803d'
                              : '#b45309',
                          border: `1px solid ${
                            sos.status === 'ACTIVE_DISTRESS'
                              ? '#fca5a5'
                              : sos.status === 'SEARCH_AND_RESCUE_DISPATCHED'
                              ? '#7dd3fc'
                              : sos.status === 'RESOLVED'
                              ? '#86efac'
                              : '#fde68a'
                          }`,
                        }}
                      >
                        {sos.status.replace(/_/g, ' ')}
                      </span>

                      {/* Location Source Tag */}
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        Source: {sos.locationSource === 'PHONE_GEOLOCATION' ? '📱 Phone GPS Lock' : sos.locationSource === 'VESSEL_LAST_KNOWN_REPORT' ? '⚓ Last Vessel Fix' : '⚠️ Location Unavailable'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={12} /> Received: {sos.serverReceivedAt}
                      </span>
                      {sos.deviceTimestamp && (
                        <span>• Device TS: {sos.deviceTimestamp}</span>
                      )}
                    </div>
                  </div>

                  {/* Operational Action Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    {sos.status === 'ACTIVE_DISTRESS' && (
                      <button
                        onClick={() => handleUpdateStatus(sos.id, 'SEARCH_AND_RESCUE_DISPATCHED')}
                        disabled={updatingId === sos.id}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', backgroundColor: '#0284c7', borderColor: '#0284c7' }}
                      >
                        <LifeBuoy size={13} />
                        <span>Dispatch SAR Craft</span>
                      </button>
                    )}

                    {sos.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleUpdateStatus(sos.id, 'RESOLVED')}
                        disabled={updatingId === sos.id}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', borderColor: '#16a34a', color: '#16a34a' }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 3-Column Detailed Telemetry Matrix */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 'var(--space-3)',
                    backgroundColor: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.825rem',
                  }}
                >
                  {/* Column 1: Fisherman Identity */}
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={14} color="var(--color-ocean-blue)" />
                      <span>Fisherman Identity</span>
                    </div>
                    <div style={{ color: '#334155' }}>
                      <strong>{sos.userName || 'Unknown'}</strong> (ID: {sos.userId})
                    </div>
                    <div style={{ color: '#0369a1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Phone size={12} /> {sos.userContact || 'Unavailable'}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                      Harbour: {sos.homeHarbour || 'Not assigned'}
                    </div>
                  </div>

                  {/* Column 2: Linked Craft */}
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Anchor size={14} color="var(--color-ocean-blue)" />
                      <span>Linked Vessel</span>
                    </div>
                    <div style={{ color: '#334155' }}>
                      <strong>{sos.vesselName || 'No boat assigned'}</strong>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      Reg: {sos.registrationNo || 'UNREGISTERED'}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                      Type: {sos.vesselType || 'Fishing Craft'}
                    </div>
                  </div>

                  {/* Column 3: Geographic Coordinates */}
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="var(--color-ocean-blue)" />
                      <span>Geographic Fix</span>
                    </div>
                    {sos.coordinates ? (
                      <>
                        <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                          {sos.coordinates[0].toFixed(5)}°N, {sos.coordinates[1].toFixed(5)}°E
                        </div>
                        {sos.accuracyMeters && (
                          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                            Accuracy: ±{sos.accuracyMeters} meters
                          </div>
                        )}
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${sos.coordinates[0]}&mlon=${sos.coordinates[1]}#map=14/${sos.coordinates[0]}/${sos.coordinates[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            color: '#0284c7',
                            fontSize: '0.75rem',
                            marginTop: '2px',
                            textDecoration: 'none',
                            fontWeight: 600,
                          }}
                        >
                          <span>Open in Maritime Map</span>
                          <ExternalLink size={11} />
                        </a>
                      </>
                    ) : (
                      <div style={{ color: '#b45309', fontSize: '0.8rem', fontWeight: 600 }}>
                        No GPS coordinates available with beacon. Coordinate rescue via port authority.
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes if available */}
                {sos.notes && (
                  <div style={{ marginTop: 'var(--space-2)', fontSize: '0.78rem', color: '#475569', fontStyle: 'italic' }}>
                    Incident Note: {sos.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Backend In-Memory Architecture Notice */}
      <div
        style={{
          padding: 'var(--space-4)',
          backgroundColor: '#eff6ff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #bfdbfe',
          fontSize: '0.8rem',
          color: '#1e40af',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <LifeBuoy size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Temporary In-Memory Storage Limitation:</strong> Emergency distress beacons are queued in the FastAPI backend process memory (`EMERGENCY_SOS_STORE`). All beacons reset when the server restarts. Persistent PostgreSQL storage will be connected during full application integration.
        </div>
      </div>
    </AdminLayout>
  );
};
