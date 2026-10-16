import React, { useState } from 'react';
import {
  Wind,
  Waves,
  CloudRain,
  Thermometer,
  Gauge,
  Eye,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatCard } from '../../../components/common/StatCard';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { mockMarineConditions } from '../../../data/mockData';
import { useLanguage } from '../../../i18n/LanguageContext';

export const MarineMonitoring: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedRegionId, setSelectedRegionId] = useState('gulf-of-mannar');
  const region = mockMarineConditions[selectedRegionId] || mockMarineConditions['gulf-of-mannar'];

  // Mock hourly swell trend for selected region
  const hourlyTrends = [
    { hour: '06:00', wave: region.waveHeightMeters * 0.8, wind: region.windSpeedKnots - 4 },
    { hour: '09:00', wave: region.waveHeightMeters * 0.9, wind: region.windSpeedKnots - 2 },
    { hour: '12:00', wave: region.waveHeightMeters, wind: region.windSpeedKnots },
    { hour: '15:00', wave: region.waveHeightMeters * 1.1, wind: region.windSpeedKnots + 3 },
    { hour: '18:00', wave: region.waveHeightMeters * 1.05, wind: region.windSpeedKnots + 2 },
    { hour: '21:00', wave: region.waveHeightMeters * 0.95, wind: region.windSpeedKnots - 1 },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={t('admin.marineTitle')}
        subtitle={t('admin.marineSubtitle')}
        badge={t('common.prototypeBadge')}
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <label htmlFor="region-select" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)' }}>
              {t('admin.selectSector')}
            </label>
            <select
              id="region-select"
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border-subtle)',
                backgroundColor: 'var(--color-surface-white)',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--color-navy-primary)',
              }}
            >
              {Object.values(mockMarineConditions).map((item) => (
                <option key={item.regionId} value={item.regionId}>
                  {item.regionName}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Demonstration Banner */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          <Clock size={16} color="var(--color-ocean-blue)" />
          <span>{language === 'ta' ? 'செயலில் உள்ள மண்டலம்:' : 'Active Coastal Zone:'} <strong>{region.coastalZone}</strong></span>
          <span>•</span>
          <span>{t('admin.lastUpdated')}: {region.lastUpdated}</span>
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
          title={t('admin.wind')}
          value={region.windSpeedKnots}
          unit="knots"
          subtitle={`${language === 'ta' ? 'திசை' : 'Direction'}: ${region.windDirection}`}
          icon={<Wind size={22} />}
          accentColor="var(--color-ocean-blue)"
        />

        <StatCard
          title={t('admin.wave')}
          value={region.waveHeightMeters}
          unit="meters"
          subtitle={`${t('admin.swellPeriod')}: ${region.swellPeriodSeconds} sec`}
          icon={<Waves size={22} />}
          accentColor={region.waveHeightMeters > 3 ? 'var(--color-danger)' : 'var(--color-teal)'}
        />

        <StatCard
          title={t('admin.rainfall')}
          value={region.rainfallMm}
          unit="mm/24h"
          subtitle={region.rainfallMm > 20 ? (language === 'ta' ? 'கனமழை பட்டை' : 'Heavy squall bands') : (language === 'ta' ? 'லேசான தூறல்' : 'Light scattered showers')}
          icon={<CloudRain size={22} />}
          accentColor="#0284c7"
        />

        <StatCard
          title={t('admin.risk')}
          value={region.riskLevel === 'extreme' ? (language === 'ta' ? 'சிவப்பு தடை' : 'Red Ban') : region.riskLevel === 'high' ? (language === 'ta' ? 'அதிவேக காற்று' : 'High Gale') : (language === 'ta' ? 'இயல்பு' : 'Normal')}
          subtitle={language === 'ta' ? 'மண்டல வானிலை மையத்திலிருந்து புதுப்பிக்கப்பட்டது' : 'Updated from Regional Meteorological Centre'}
          icon={<AlertCircle size={22} />}
          accentColor={region.riskLevel === 'extreme' ? '#991b1b' : '#f59e0b'}
        />
      </div>

      {/* Weather Trends & Secondary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {/* Swell & Wave Progression Chart Placeholder */}
        <div className="card-base" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                {t('admin.hourlyTrend')}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                {region.regionName} {language === 'ta' ? '(மாதிரி அளவீடுகள்)' : '(Sample Data)'}
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
            <span>Axis: {t('admin.wave')} (m) over 24-Hour Cycle</span>
            <span>INCOIS SWAN Model (Sample Mock)</span>
          </div>
        </div>

        {/* Ocean Surface Telemetry */}
        <div className="card-base" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: 'var(--space-2)' }}>
              {t('admin.telemetryCards')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              {language === 'ta' ? 'கடல் மிதவை மற்றும் கடலோர நிலைய சென்சார்கள்' : 'Moored buoy & coastal station sensors'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Thermometer size={16} color="var(--color-ocean-blue)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{t('admin.waterTemp')}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{region.seaSurfaceTempC}°C</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Gauge size={16} color="var(--color-ocean-blue)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{t('admin.barometer')}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{region.barometricPressureHpa} hPa</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={16} color="var(--color-ocean-blue)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {language === 'ta' ? 'பார்வைத் தூரம்' : 'Visibility'}
                  </span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{region.visibilityKm} km</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-4)', padding: '0.75rem', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: '0.2rem' }}>
              {t('admin.forecastHeadline')}:
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              {region.forecastSummary}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default MarineMonitoring;
