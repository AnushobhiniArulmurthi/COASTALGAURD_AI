import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Waves,
  Eye,
  Thermometer,
  Info,
  Navigation,
  Move
} from 'lucide-react';
import L from 'leaflet';
import { FishermanLayout } from '../../../components/layout/FishermanLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { mockMarineConditions, mockHarbours } from '../../../data/mockData';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { HarbourPort } from '../../../types';

const REGION_COORDINATES: Record<string, [number, number]> = {
  'gulf-of-mannar': [9.2876, 79.3129],
  'palk-strait': [9.45, 79.25],
  'chennai-coromandel': [13.1256, 80.2974],
  'kanyakumari-cape': [8.0931, 77.5614],
  'nagapattinam-delta': [10.7634, 79.8458],
};

export const MarineConditionsMap: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedRegionKey, setSelectedRegionKey] = useState('gulf-of-mannar');
  const [selectedPort, setSelectedPort] = useState<HarbourPort>(mockHarbours[0]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const condition =
    mockMarineConditions[selectedRegionKey] || mockMarineConditions['gulf-of-mannar'];

  // Initialize or update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map is already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [9.2876, 79.3129], // Rameswaram
        zoom: 7,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add Harbour Markers with custom divIcon
      mockHarbours.forEach((port) => {
        const portIcon = L.divIcon({
          className: 'custom-harbour-pin',
          html: `<div style="background-color: #0284c7; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 14px; cursor: pointer;">⚓</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker(port.coordinates, { icon: portIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; min-width: 140px;">
            <strong style="color: #0b192c; font-size: 13px;">${port.name}</strong><br/>
            <span style="color: #0d9488; font-size: 11px;">${port.tamilName || ''}</span><br/>
            <span style="font-size: 11px; color: #64748b;">${t('fisherman.vhf')}: ${port.vhfEmergencyChannel}</span><br/>
            <span style="font-size: 11px; font-weight: bold; color: ${port.status === 'Open' ? '#10b981' : '#f59e0b'};">
              ${t('admin.signalStatus')}: ${port.status}
            </span>
          </div>
        `);

        marker.on('click', () => {
          setSelectedPort(port);
        });
      });

      // Add Sample Boat Location Marker (Kadalarasan)
      const boatIcon = L.divIcon({
        className: 'custom-boat-pin',
        html: `<div style="background-color: #0d9488; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid #2dd4bf; box-shadow: 0 0 12px rgba(45, 212, 191, 0.7); font-size: 17px; cursor: pointer;">🚤</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const boatMarker = L.marker([9.3, 79.36], { icon: boatIcon }).addTo(map);
      boatMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; min-width: 160px;">
          <strong style="color: #0d9488;">${language === 'ta' ? 'உங்கள் படகு: கடலரசன்' : 'Your Vessel: Kadalarasan'}</strong><br/>
          <span style="font-size: 11px; color: #475569;">Reg: IND-TN-10-MM-4021</span><br/>
          <span style="font-size: 11px; color: #10b981; font-weight: bold;">${language === 'ta' ? 'ஜிபிஎஸ் சிக்னல் இணைக்கப்பட்டது' : 'Simulated GPS Synced (12m ago)'}</span>
        </div>
      `);

      mapInstanceRef.current = map;
    }

    // Invalidate size to ensure clean render
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [language, t]);

  // Pan to region when region selection changes
  useEffect(() => {
    if (mapInstanceRef.current && REGION_COORDINATES[selectedRegionKey]) {
      mapInstanceRef.current.flyTo(REGION_COORDINATES[selectedRegionKey], 8, { duration: 1.0 });
    }
  }, [selectedRegionKey]);

  const handleSelectPort = (port: HarbourPort) => {
    setSelectedPort(port);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(port.coordinates, 10, { duration: 1.2 });
    }
  };

  return (
    <FishermanLayout>
      <PageHeader
        title={t('fisherman.mapTitle')}
        subtitle={t('fisherman.mapSubtitle')}
        badge={t('common.demoBadge')}
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)' }}>
              {t('admin.selectSector')}
            </span>
            <select
              value={selectedRegionKey}
              onChange={(e) => setSelectedRegionKey(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-teal)',
                backgroundColor: 'var(--color-surface-white)',
                fontWeight: 700,
                fontSize: '0.85rem',
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

      {/* Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginBottom: 'var(--space-6)',
          fontSize: '0.85rem',
          color: '#166534',
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>{language === 'ta' ? 'ஊடாடும் வரைபடம் (OpenStreetMap & Leaflet):' : 'Interactive Map (OpenStreetMap & Leaflet):'}</strong>{' '}
          {language === 'ta'
            ? 'வரைபடத்தை எந்த திசையிலும் இழுத்து நகர்த்தலாம் (மேல்/கீழ்/இடது/வலது). துறைமுகங்கள் (⚓) மற்றும் உங்கள் படகின் மாதிரி இருப்பிடம் (🚤) காட்டப்படுகின்றன.'
            : 'Click and drag in all directions (left, right, up, down). Verified coastal ports along Tamil Nadu (⚓) and your sample boat location (🚤) are displayed.'}
        </div>
      </div>

      {/* Forecast Conditions Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-ocean-soft)', color: 'var(--color-ocean-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wind size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('admin.wind')}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>{condition.windSpeedKnots} kts</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{condition.windDirection}</div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: '#ccfbf1', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Waves size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('admin.wave')}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>{condition.waveHeightMeters}m</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{condition.swellPeriodSeconds}s {t('admin.swellPeriod')}</div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {language === 'ta' ? 'பார்வைத் தூரம்' : 'Visibility'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>{condition.visibilityKm} km</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {language === 'ta' ? 'இயல்பான கடல் பார்வை' : 'Standard sea line'}
            </div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Thermometer size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('admin.waterTemp')}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>{condition.seaSurfaceTempC}°C</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>1004 hPa Barometer</div>
          </div>
        </div>
      </div>

      {/* Main Map & Port Selection Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {/* Leaflet Map Canvas */}
        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', padding: '0 0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={18} color="var(--color-teal)" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-navy-primary)' }}>
                {t('fisherman.nauticalMap')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              <span>⚓ {t('fisherman.harbourPin')}</span>
              <span>🚤 {t('fisherman.boatPin')}</span>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '460px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-subtle)' }}>
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: '100%',
                zIndex: 1,
              }}
            />

            {/* Draggable hint indicator */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 500,
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#38bdf8',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                pointerEvents: 'none',
              }}
            >
              <Move size={12} />
              <span>{language === 'ta' ? 'இழுத்து நகர்த்தலாம்' : 'Draggable Map'}</span>
            </div>
          </div>
          
          <div style={{ marginTop: 'var(--space-2)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            {t('fisherman.mapDragHelp')}
          </div>
        </div>

        {/* Selected Port & Safe Haven Details Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Selected Port Inspector */}
          <div className="card-base" style={{ padding: 'var(--space-5)', borderTop: '4px solid var(--color-ocean-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                  {language === 'ta' && selectedPort.tamilName ? selectedPort.tamilName : selectedPort.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                  {selectedPort.district}
                </div>
              </div>
              <StatusBadge status={selectedPort.status} size="sm" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{t('fisherman.vhf')}:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-ocean-blue)' }}>{selectedPort.vhfEmergencyChannel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{t('fisherman.shelterCap')}:</span>
                <span style={{ fontWeight: 600 }}>{selectedPort.shelterCapacityBoats} {t('fisherman.crafts')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{t('fisherman.depth')}:</span>
                <span style={{ fontWeight: 600 }}>{selectedPort.depthMeters} m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{t('admin.coordinates')}:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {selectedPort.coordinates[0].toFixed(3)}°N, {selectedPort.coordinates[1].toFixed(3)}°E
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSelectPort(selectedPort)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'var(--space-4)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}
            >
              <Navigation size={15} /> {t('fisherman.flyToPort')}
            </button>
          </div>

          {/* Quick Safe Haven Waypoint Selector */}
          <div className="card-base" style={{ padding: 'var(--space-5)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: 'var(--space-3)' }}>
              {t('fisherman.nearbyPorts')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {mockHarbours.map((port) => (
                <div
                  key={port.id}
                  onClick={() => handleSelectPort(port)}
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: selectedPort.id === port.id ? 'var(--color-teal)' : 'var(--color-border-light)',
                    backgroundColor: selectedPort.id === port.id ? '#f0fdfa' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                      {language === 'ta' && port.tamilName ? port.tamilName : port.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {port.district} • {port.vhfEmergencyChannel}
                    </div>
                  </div>
                  <StatusBadge status={port.status} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FishermanLayout>
  );
};
export default MarineConditionsMap;
