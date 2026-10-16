import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Waves,
  Eye,
  Thermometer,
  Info,
  Navigation
} from 'lucide-react';
import L from 'leaflet';
import { FishermanLayout } from '../../../components/layout/FishermanLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { mockMarineConditions, mockHarbours } from '../../../data/mockData';
import type { HarbourPort } from '../../../types';

export const MarineConditionsMap: React.FC = () => {
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
        scrollWheelZoom: true,
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
          html: `<div style="background-color: #0284c7; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 14px;">⚓</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker(port.coordinates, { icon: portIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #0b192c; font-size: 13px;">${port.name}</strong><br/>
            <span style="color: #0d9488; font-size: 11px;">${port.tamilName || ''}</span><br/>
            <span style="font-size: 11px; color: #64748b;">Emergency: ${port.vhfEmergencyChannel}</span><br/>
            <span style="font-size: 11px; font-weight: bold; color: ${port.status === 'Open' ? '#10b981' : '#f59e0b'};">Status: ${port.status}</span>
          </div>
        `);

        marker.on('click', () => {
          setSelectedPort(port);
        });
      });

      // Add Sample Boat Location Marker (Kadalarasan)
      const boatIcon = L.divIcon({
        className: 'custom-boat-pin',
        html: `<div style="background-color: #0d9488; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid #2dd4bf; box-shadow: 0 0 10px rgba(45, 212, 191, 0.6); font-size: 16px;">🚤</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const boatMarker = L.marker([9.3, 79.36], { icon: boatIcon }).addTo(map);
      boatMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <strong style="color: #0d9488;">Your Vessel: Kadalarasan (Sample Beacon)</strong><br/>
          <span style="font-size: 11px; color: #475569;">Reg: IND-TN-10-MM-4021</span><br/>
          <span style="font-size: 11px; color: #10b981; font-weight: bold;">Simulated GPS Synced (12m ago)</span>
        </div>
      `);

      mapInstanceRef.current = map;
    }

    // Invalidate size to ensure clean render
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      // Clean up map on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSelectPort = (port: HarbourPort) => {
    setSelectedPort(port);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(port.coordinates, 10, { duration: 1.2 });
    }
  };

  return (
    <FishermanLayout>
      <PageHeader
        title="Marine Conditions & Coastal Map"
        subtitle="Live open-sea nautical map, safe haven harbour waypoints, VHF radio channels, and local swell telemetry."
        badge="Demonstration Map"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)' }}>
              Region:
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
          <strong>Leaflet & OpenStreetMap Prototype:</strong> Map displays verified coastal ports along the Tamil Nadu coastline. The device/boat location marker (🚤) is a sample coordinate for demo purposes.
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
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Wind Velocity</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>{condition.windSpeedKnots} kts</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{condition.windDirection}</div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: '#ccfbf1', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Waves size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Wave Height</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>{condition.waveHeightMeters}m</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{condition.swellPeriodSeconds}s swell period</div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Visibility</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>{condition.visibilityKm} km</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Standard sea line</div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Thermometer size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Water Surface</div>
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
                Nautical Map (OpenStreetMap Marine View)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              <span>⚓ Harbour Pin</span>
              <span>🚤 Sample Boat</span>
            </div>
          </div>

          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '460px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--color-border-subtle)',
            }}
          />
        </div>

        {/* Selected Port & Safe Haven Details Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Selected Port Inspector */}
          <div className="card-base" style={{ padding: 'var(--space-5)', borderTop: '4px solid var(--color-ocean-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                  {selectedPort.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                  {selectedPort.tamilName}
                </div>
              </div>
              <StatusBadge status={selectedPort.status} size="sm" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.85rem', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>District Coast:</span>
                <span style={{ fontWeight: 600 }}>{selectedPort.district}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Emergency VHF:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-ocean-blue)' }}>{selectedPort.vhfEmergencyChannel}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Shelter Capacity:</span>
                <span style={{ fontWeight: 600 }}>{selectedPort.shelterCapacityBoats} Vessels</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Navigation Depth:</span>
                <span style={{ fontWeight: 600 }}>{selectedPort.depthMeters} meters</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Safe Haven Status:</span>
                <span style={{ fontWeight: 600, color: '#166534' }}>✓ Designated All-Weather</span>
              </div>
            </div>

            <div style={{ padding: '0.65rem', backgroundColor: 'var(--color-ocean-soft)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#0369a1' }}>
              💡 <strong>Safety Tip:</strong> Switch your on-board wireless transponder to {selectedPort.vhfEmergencyChannel} when within 5 nautical miles.
            </div>
          </div>

          {/* Quick List of All Harbours to Click */}
          <div className="card-base" style={{ padding: 'var(--space-4)', flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: 'var(--space-3)' }}>
              Nearby Ports & Shelters (Click to Fly)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {mockHarbours.map((port) => (
                <button
                  key={port.id}
                  onClick={() => handleSelectPort(port)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: selectedPort.id === port.id ? 'var(--color-ocean-blue)' : 'var(--color-border-light)',
                    backgroundColor: selectedPort.id === port.id ? 'var(--color-ocean-soft)' : 'var(--color-bg-alt)',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)' }}>
                      {port.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {port.district} • {port.vhfEmergencyChannel}
                    </div>
                  </div>
                  <StatusBadge status={port.status} size="sm" showIcon={false} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FishermanLayout>
  );
};
