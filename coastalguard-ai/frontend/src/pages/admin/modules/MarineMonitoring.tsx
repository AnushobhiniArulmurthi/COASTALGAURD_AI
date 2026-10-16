import React, { useState, useEffect, useCallback } from 'react';
import {
  Wind,
  Waves,
  CloudRain,
  Thermometer,
  Gauge,
  Eye,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatCard } from '../../../components/common/StatCard';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { marineService } from '../../../services/marineService';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import type { MarineCondition, BackendStatus } from '../../../types';

export const MarineMonitoring: React.FC = () => {
  const { t, language } = useAdminLanguage();
  const [conditions, setConditions] = useState<Record<string, MarineCondition>>({});
  const [selectedRegionId, setSelectedRegionId] = useState('gulf-of-mannar');
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Pending...');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fetchConditions = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const result = await marineService.getMarineConditions();
      setConditions(result.conditions);
      setBackendStatus(result.isBackendLive ? 'connected' : 'disconnected');
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
      if (result.error) {
        setErrorNotice(result.error);
      } else {
        setErrorNotice(null);
      }
    } catch (err: unknown) {
      setBackendStatus('error');
      setErrorNotice(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchConditions();
  }, [fetchConditions]);

  const regionList = Object.values(conditions);
  const region = conditions[selectedRegionId] || regionList[0] || null;

  // Hourly swell progression
  const hourlyTrends = region
    ? [
        { hour: '06:00', wave: region.waveHeightMeters * 0.8, wind: region.windSpeedKnots - 4 },
        { hour: '09:00', wave: region.waveHeightMeters * 0.9, wind: region.windSpeedKnots - 2 },
        { hour: '12:00', wave: region.waveHeightMeters, wind: region.windSpeedKnots },
        { hour: '15:00', wave: region.waveHeightMeters * 1.1, wind: region.windSpeedKnots + 3 },
        { hour: '18:00', wave: region.waveHeightMeters * 1.05, wind: region.windSpeedKnots + 2 },
        { hour: '21:00', wave: region.waveHeightMeters * 0.95, wind: region.windSpeedKnots - 1 },
      ]
    : [];

  return (
    <AdminLayout>
      <PageHeader
        title={t('marine.title', 'Marine Monitoring')}
        subtitle={t('marine.subtitle', 'Sector-wise oceanographic readings, wave height telemetry, wind vectors, and meteorological forecasts.')}
        badge="Telemetry Console"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {/* Refresh Button */}
            <button
              onClick={() => fetchConditions(false)}
              disabled={isRefreshing}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{t('status.refresh_now', 'Refresh Now')}</span>
            </button>

            {/* Sector Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label htmlFor="region-select" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)' }}>
                {t('marine.select_sector', 'Select Sector:')}
              </label>
              <select
                id="region-select"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border-subtle)',
                  backgroundColor: 'var(--color-surface-white)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: 'var(--color-navy-primary)',
                }}
              >
                {regionList.map((item) => (
                  <option key={item.regionId} value={item.regionId}>
                    {item.regionName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
      />

      {/* Loading State */}
      {isLoading ? (
        <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto var(--space-3)' }} />
          <div>{t('status.loading', 'Loading oceanographic readings...')}</div>
        </div>
      ) : !region ? (
        /* Empty State */
        <div className="card-base" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <AlertCircle size={32} color="var(--color-text-muted)" style={{ margin: '0 auto var(--space-2)' }} />
          <div style={{ fontWeight: 700 }}>{t('status.no_records', 'No marine data available')}</div>
        </div>
      ) : (
        <>
          {/* Active Sector Metadata Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: 'var(--space-6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
              <Clock size={16} color="var(--color-ocean-blue)" />
              <span>{t('marine.zone', 'Active Coastal Zone:')} <strong>{region.coastalZone}</strong></span>
              <span>•</span>
              <span>{t('marine.last_sync', 'Last Sync:')} {region.lastUpdated}</span>
            </div>
            <StatusBadge status={region.riskLevel} />
          </div>

          {/* 4 Primary Marine Telemetry Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-5)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <StatCard
              title={t('marine.wind', 'Wind Velocity')}
              value={region.windSpeedKnots}
              unit="knots"
              subtitle={`Direction: ${region.windDirection}`}
              icon={<Wind size={22} />}
              accentColor="var(--color-ocean-blue)"
            />

            <StatCard
              title={t('marine.wave', 'Significant Wave Height')}
              value={region.waveHeightMeters}
              unit="meters"
              subtitle={`Swell Period: ${region.swellPeriodSeconds} sec`}
              icon={<Waves size={22} />}
              accentColor={region.waveHeightMeters > 3 ? 'var(--color-danger)' : 'var(--color-teal)'}
            />

            <StatCard
              title={t('marine.rainfall', 'Precipitation / Rainfall')}
              value={region.rainfallMm}
              unit="mm/24h"
              subtitle={region.rainfallMm > 20 ? 'Heavy squall bands' : 'Light scattered showers'}
              icon={<CloudRain size={22} />}
              accentColor="#0284c7"
            />

            <StatCard
              title={t('marine.advisory', 'Forecast Advisory Status')}
              value={region.riskLevel === 'extreme' ? 'Red Ban' : region.riskLevel === 'high' ? 'High Gale' : 'Normal'}
              subtitle="Updated from Regional Meteorological Centre"
              icon={<AlertCircle size={22} />}
              accentColor={region.riskLevel === 'extreme' ? '#991b1b' : '#f59e0b'}
            />
          </div>

          {/* Weather Trends & Secondary Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            {/* Swell Progression Chart */}
            <div className="card-base" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                    {t('marine.progression_title', 'Diurnal Swell & Wave Height Progression')}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {t('marine.progression_sub', 'Timeline progression for selected sector')} — {region.regionName}
                  </p>
                </div>
                <span className="badge-prototype">
                  <Sparkles size={11} /> Wave Spectrogram
                </span>
              </div>

              {/* Bar Chart Visualization */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 'var(--space-3)',
                  alignItems: 'flex-end',
                  height: '180px',
                  padding: 'var(--space-4) 0 0',
                  borderBottom: '2px solid var(--color-border-subtle)',
                }}
              >
                {hourlyTrends.map((trend, i) => {
                  const maxWave = 5.0;
                  const barHeightPct = Math.min(100, Math.round((trend.wave / maxWave) * 100));
                  const isPeak = barHeightPct > 60;

                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isPeak ? 'var(--color-danger)' : 'var(--color-navy-primary)', marginBottom: '4px' }}>
                        {trend.wave.toFixed(1)}m
                      </span>
                      <div
                        style={{
                          width: '60%',
                          maxWidth: '42px',
                          height: `${barHeightPct}%`,
                          backgroundColor: isPeak ? 'var(--color-danger)' : 'var(--color-ocean-blue)',
                          borderRadius: 'var(--radius-xs) var(--radius-xs) 0 0',
                          transition: 'height 0.3s ease',
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                        {trend.hour}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-4)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <span>Axis: Significant Wave Height (m) over 24-Hour Cycle</span>
                <span>Source: CoastalGuard Telemetry Feed</span>
              </div>
            </div>

            {/* Atmospheric & Sea Metrics */}
            <div className="card-base" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: 'var(--space-2)' }}>
                  {t('marine.metrics_title', 'Atmospheric & Sea Metrics')}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                  {t('marine.metrics_sub', 'Moored buoy & coastal station sensors')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Thermometer size={16} color="var(--color-ocean-blue)" />
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{t('marine.sst', 'Sea Surface Temp')}</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{region.seaSurfaceTempC}°C</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Gauge size={16} color="var(--color-ocean-blue)" />
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{t('marine.pressure', 'Barometric Pressure')}</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{region.barometricPressureHpa} hPa</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Eye size={16} color="var(--color-ocean-blue)" />
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{t('marine.visibility', 'Horizontal Visibility')}</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{region.visibilityKm} km</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-4)', padding: '0.75rem', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: '0.2rem' }}>
                  {t('marine.met_summary', 'Meteorological Summary:')}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {region.forecastSummary}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};
