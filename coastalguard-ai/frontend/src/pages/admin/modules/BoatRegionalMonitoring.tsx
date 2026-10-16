import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Radio,
  AlertTriangle,
  Search,
  Sparkles,
  Navigation,
  Move
} from 'lucide-react';
import L from 'leaflet';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { mockVessels, mockHarbours } from '../../../data/mockData';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { VesselReport } from '../../../types';

export const BoatRegionalMonitoring: React.FC = () => {
  const { t, language } = useLanguage();
  const [filterPort, setFilterPort] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVessel, setSelectedVessel] = useState<VesselReport | null>(mockVessels[0]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vesselMarkersRef = useRef<Map<string, L.Marker>>(new Map());

  const filteredVessels = mockVessels.filter((vessel) => {
    const matchesPort =
      filterPort === 'all' || vessel.homePort.toLowerCase().includes(filterPort.toLowerCase());
    const matchesSearch =
      vessel.boatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vessel.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vessel.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPort && matchesSearch;
  });

  // Initialize interactive Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [10.2, 79.2],
        zoom: 7,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add Harbours
      mockHarbours.forEach((port) => {
        const portIcon = L.divIcon({
          className: 'custom-admin-harbour-pin',
          html: `<div style="background-color: #0369a1; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35); font-size: 13px;">⚓</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(port.coordinates, { icon: portIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; min-width: 150px;">
            <strong style="color: #0b192c; font-size: 13px;">${port.name}</strong><br/>
            <span style="color: #0284c7; font-size: 11px;">${port.tamilName || ''}</span><br/>
            <span style="font-size: 11px; color: #64748b;">${t('admin.radioChannel')}: ${port.vhfEmergencyChannel}</span><br/>
            <span style="font-size: 11px; font-weight: bold; color: ${port.status === 'Open' ? '#10b981' : '#f59e0b'};">${t('admin.signalStatus')}: ${port.status}</span>
          </div>
        `);
      });

      // Add Danger Polygon in Gulf of Mannar
      const cautionPolygon = L.polygon(
        [
          [9.35, 78.85],
          [9.45, 79.55],
          [8.85, 79.45],
          [8.55, 78.35],
        ],
        {
          color: '#ef4444',
          weight: 2,
          dashArray: '6, 6',
          fillColor: '#ef4444',
          fillOpacity: 0.15,
        }
      ).addTo(map);

      cautionPolygon.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <strong style="color: #b91c1c;">${language === 'ta' ? 'புயல் அலை எச்சரிக்கை மண்டலம் (பகுதி 4)' : 'Gale Swell Caution Zone (Sector 4)'}</strong><br/>
          <span style="font-size: 11px; color: #64748b;">Gulf of Mannar — High Wave Surge Advisory</span>
        </div>
      `);

      // Add Vessel Markers
      vesselMarkersRef.current.clear();
      mockVessels.forEach((v) => {
        const color =
          v.status === 'sample' ? '#10b981' : v.status === 'stale' ? '#f59e0b' : '#ef4444';
        const vesselIcon = L.divIcon({
          className: 'custom-admin-vessel-pin',
          html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); font-size: 15px; cursor: pointer;">🚤</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(v.coordinates, { icon: vesselIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; min-width: 160px;">
            <strong style="color: #0b192c; font-size: 13px;">${v.boatName}</strong><br/>
            <span style="font-size: 11px; color: #64748b;">Reg: ${v.registrationNumber}</span><br/>
            <span style="font-size: 11px; color: #0284c7;">${v.ownerName}</span><br/>
            <span style="font-size: 11px; font-weight: bold; color: ${color};">${v.lastReportedTime}</span>
          </div>
        `);

        marker.on('click', () => {
          setSelectedVessel(v);
        });

        vesselMarkersRef.current.set(v.id, marker);
      });

      mapInstanceRef.current = map;
    }

    // Invalidate size to guarantee smooth render
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

  const handleSelectVessel = (v: VesselReport) => {
    setSelectedVessel(v);
    if (mapInstanceRef.current && v.coordinates) {
      mapInstanceRef.current.flyTo(v.coordinates, 9, { duration: 1.0 });
      const marker = vesselMarkersRef.current.get(v.id);
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title={t('admin.boatTitle')}
        subtitle={t('admin.boatSubtitle')}
        badge={t('common.prototypeBadge')}
        action={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <span
              className="badge-prototype"
              style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}
            >
              <Radio size={12} /> {t('admin.fleetMock')}
            </span>
          </div>
        }
      />

      {/* Critical Demonstration Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginBottom: 'var(--space-6)',
          fontSize: '0.85rem',
          color: '#92400e',
        }}
      >
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>{language === 'ta' ? 'குறிப்பு:' : 'Disclaimer:'}</strong>{' '}
          {language === 'ta'
            ? 'வரைபடத்தின் மீது எந்த திசையிலும் (மேல், கீழ், இடது, வலது) இழுத்து நகர்த்தலாம். சோதனை நோக்கங்களுக்கான மாதிரி படகு ஆயங்கள் காட்டப்படுகின்றன.'
            : 'Interactive maritime map can be dragged in all directions (up, down, left, right). Simulated vessel positions and coordinates are shown for demonstration.'}
        </div>
      </div>

      {/* Top Map Schematic & Selection Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {/* Real Interactive Leaflet Marine Map */}
        <div
          className="card-base"
          style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-3)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Navigation size={18} color="var(--color-ocean-blue)" />
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--color-navy-primary)',
                  }}
                >
                  {language === 'ta'
                    ? 'மண்டல படகு கண்காணிப்பு வரைபடம்'
                    : 'Regional Vessel Presence Map'}
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                {language === 'ta'
                  ? 'தமிழ்நாடு கடற்கரை & மன்னார் வளைகுடா நேரலை செயற்கைக்கோள் வரைபடம்'
                  : 'OpenStreetMap nautical view across Tamil Nadu & Gulf of Mannar'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="badge-prototype">
                <Sparkles size={11} /> {t('common.demoBadge')}
              </span>
            </div>
          </div>

          {/* Map Leaflet Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: '420px',
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

            {/* Map Legend Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                backgroundColor: 'rgba(11, 25, 44, 0.92)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: '#ffffff',
                border: '1px solid #1e3a5f',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 500,
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '2px' }}>
                {language === 'ta' ? 'படகு சிக்னல் நிலை' : 'Vessel Beacon Status'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }}
                />
                <span>
                  {language === 'ta' ? 'செயலில் உள்ள சிக்னல் (<30நி)' : 'Sample Synced (< 30m)'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b' }}
                />
                <span>
                  {language === 'ta' ? 'பழைய சிக்னல் (>2மணி)' : 'Stale Transponder (> 2h)'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }}
                />
                <span>
                  {language === 'ta' ? 'ஆஃப்லைன் / சிக்னல் இல்லை' : 'Unknown / Offline Signal'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Vessel Inspector Card */}
        <div
          className="card-base"
          style={{
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: 'var(--space-2)',
              }}
            >
              <Compass size={20} color="var(--color-ocean-blue)" />
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--color-navy-primary)',
                }}
              >
                {t('admin.vesselDetails')}
              </h3>
            </div>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              {language === 'ta'
                ? 'விவரங்களை ஆய்வு செய்ய வரைபடம் அல்லது அட்டவணையில் ஒரு படகைக் கிளிக் செய்யவும்'
                : 'Click any vessel on the map or table to inspect details'}
            </p>

            {selectedVessel ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-bg-alt)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: 'var(--color-navy-primary)',
                    }}
                  >
                    {selectedVessel.boatName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {t('admin.registration')}: {selectedVessel.registrationNumber}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid var(--color-border-light)',
                  }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('admin.owner')}:</span>
                  <span style={{ fontWeight: 600 }}>{selectedVessel.ownerName}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid var(--color-border-light)',
                  }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('admin.homeHarbour')}:</span>
                  <span style={{ fontWeight: 600 }}>{selectedVessel.homePort}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid var(--color-border-light)',
                  }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('admin.coordinates')}:</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-ocean-blue)' }}>
                    {selectedVessel.reportedLocation}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid var(--color-border-light)',
                  }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('admin.lastUpdated')}:</span>
                  <span style={{ fontWeight: 600 }}>{selectedVessel.lastReportedTime}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    paddingTop: '0.2rem',
                  }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('admin.signalStatus')}:</span>
                  <StatusBadge status={selectedVessel.status} size="sm" />
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {language === 'ta'
                  ? 'விவரங்களை ஆய்வு செய்ய ஒரு படகைத் தேர்ந்தெடுக்கவும்.'
                  : 'Select a craft to review coordinates and transponder health.'}
              </p>
            )}
          </div>

          <div
            style={{
              marginTop: 'var(--space-4)',
              padding: '0.65rem',
              backgroundColor: '#f0fdf4',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #bbf7d0',
              fontSize: '0.75rem',
              color: '#166534',
            }}
          >
            ✓ {language === 'ta' ? 'டிரான்ஸ்பாண்டர் சிக்னல் சோதனை முடிந்தது (மாதிரி)' : 'Transponder integrity check passed (Simulation).'}
          </div>
        </div>
      </div>

      {/* Filterable Vessel Table */}
      <div className="card-base" style={{ padding: 'var(--space-6)' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--color-navy-primary)',
              }}
            >
              {t('admin.vesselRoster')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {language === 'ta'
                ? 'கண்காணிக்கப்படும் மீன்பிடித் துறைமுகங்களின் மாதிரி படகு நிலைகள்'
                : 'Mock vessel positions across monitored fishing ports'}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 10,
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                type="text"
                placeholder={t('admin.searchBoats')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            {/* Port Filter */}
            <select
              value={filterPort}
              onChange={(e) => setFilterPort(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-navy-primary)',
              }}
            >
              <option value="all">{t('admin.allPorts')}</option>
              <option value="Rameswaram">Rameswaram</option>
              <option value="Kasimedu">Kasimedu (Chennai)</option>
              <option value="Tuticorin">Tuticorin</option>
              <option value="Chinnamuttam">Chinnamuttam (Kanyakumari)</option>
              <option value="Nagapattinam">Nagapattinam</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-bg-alt)',
                  borderBottom: '1px solid var(--color-border-light)',
                }}
              >
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.boatName')} & {t('admin.registration')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.owner')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.homeHarbour')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.coordinates')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.lastUpdated')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.signalStatus')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredVessels.map((v) => (
                <tr
                  key={v.id}
                  style={{
                    borderBottom: '1px solid var(--color-border-light)',
                    backgroundColor:
                      selectedVessel?.id === v.id ? 'rgba(2, 132, 199, 0.06)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelectVessel(v)}
                >
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                      {v.boatName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {v.registrationNumber}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{v.ownerName}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{v.homePort}</td>
                  <td
                    style={{
                      padding: '0.75rem 1rem',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                    }}
                  >
                    {v.reportedLocation}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-secondary)' }}>
                    {v.lastReportedTime}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <StatusBadge status={v.status} size="sm" />
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectVessel(v);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      {language === 'ta' ? 'ஆய்வு செய்' : 'Inspect'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default BoatRegionalMonitoring;
