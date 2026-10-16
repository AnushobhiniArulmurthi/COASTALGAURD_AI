import React, { useState, useEffect, useCallback, useRef } from 'react';
import L from 'leaflet';
import {
  Compass,
  Search,
  RefreshCw,
  Sliders,
  Play,
  Pause,
  Navigation,
  Crosshair,
  Info,
  Layers,
  RotateCcw,
  ShieldCheck,
  Radio,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Activity,
  WifiOff
} from 'lucide-react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { vesselService } from '../../../services/vesselService';
import { mockHarbours } from '../../../data/mockData';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { gpsTestingService, type GpsTestingState } from '../../../services/gpsTestingService';
import type { VesselReport } from '../../../types';

// Geographic bounds for Tamil Nadu coastal waters
const GEO_BOUNDS = {
  maxLat: 13.50, // North (Pulicat / Chennai)
  minLat: 8.00,  // South (Kanyakumari)
  minLng: 77.20, // West
  maxLng: 80.60, // East (Bay of Bengal / Gulf of Mannar)
};

// Coastal Danger & Caution Zones (Real Geographic Polygons)
const RISK_ZONES = [
  {
    id: 'gulf-of-mannar',
    name: 'Gulf of Mannar Caution Corridor (Sector 4)',
    tamilName: 'மன்னார் வளைகுடா எச்சரிக்கை மண்டலம்',
    severity: 'High Caution (Gale Swell)',
    description: 'High swell alert: Winds 28-35 knots, waves 3.2m. Small craft advised to seek shelter.',
    color: '#f59e0b',
    fillColor: '#f59e0b',
    fillOpacity: 0.16,
    coordinates: [
      [8.40, 78.15],
      [9.25, 79.35],
      [9.10, 79.65],
      [8.30, 78.50],
    ] as [number, number][],
  },
  {
    id: 'kanyakumari-cape',
    name: 'Kanyakumari Cyclonic Surge Red Zone (Sector 5)',
    tamilName: 'கன்னியாகுமரி தீவிர பேரலை சிவப்பு மண்டலம்',
    severity: 'Extreme Danger (Cyclonic Waves)',
    description: 'Extreme sea warning: Waves up to 4.5m with strong westerly squalls. Absolute fishing ban.',
    color: '#ef4444',
    fillColor: '#ef4444',
    fillOpacity: 0.20,
    coordinates: [
      [7.75, 77.10],
      [8.20, 77.10],
      [8.20, 77.75],
      [7.75, 77.75],
    ] as [number, number][],
  },
  {
    id: 'palk-strait-boundary',
    name: 'Palk Strait Coral & Boundary Corridor (Sector 3)',
    tamilName: 'பாக் நீரிணை பவளப்பாறை & எல்லை மண்டலம்',
    severity: 'Navigation Caution',
    description: 'Shallow coral reef zones and proximity to International Maritime Boundary Line (IMBL).',
    color: '#0284c7',
    fillColor: '#0284c7',
    fillOpacity: 0.12,
    coordinates: [
      [9.25, 79.15],
      [9.60, 79.70],
      [9.80, 79.90],
      [9.45, 79.25],
    ] as [number, number][],
  },
];

export const BoatRegionalMonitoring: React.FC = () => {
  const { t, language } = useAdminLanguage();
  const [vessels, setVessels] = useState<VesselReport[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<VesselReport | null>(null);
  const [filterPort, setFilterPort] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [freshnessThresholdMinutes, setFreshnessThresholdMinutes] = useState<number>(30);
  const [isSimulatingMotion, setIsSimulatingMotion] = useState(true);
  const [isFollowMode, setIsFollowMode] = useState(false);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showPorts, setShowPorts] = useState(true);
  const [showIntegrationGuide, setShowIntegrationGuide] = useState(false);

  // Isolated Browser GPS Testing State
  const [gpsState, setGpsState] = useState<GpsTestingState>(gpsTestingService.getState());
  const [testVesselId, setTestVesselId] = useState<string>('vessel-gps-test');
  const [showGpsTestingTool, setShowGpsTestingTool] = useState(false);

  // Leaflet Map & Layer References
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vesselMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const riskZonesGroupRef = useRef<L.LayerGroup | null>(null);
  const portsGroupRef = useRef<L.LayerGroup | null>(null);
  const vesselsGroupRef = useRef<L.LayerGroup | null>(null);

  // Directional drift states for realistic simulated vessel routes
  const routeDirections = useRef<Record<string, number>>({});

  // Helper: check freshness
  const isVesselTrackable = useCallback((v: VesselReport): boolean => {
    const hasCoordinates = Array.isArray(v.coordinates) && v.coordinates.length === 2 && !isNaN(v.coordinates[0]);
    if (!hasCoordinates) return false;

    // Real GPS telemetry freshness check
    if (v.isLiveGps || v.trackingSource === 'LIVE_GPS') {
      if (v.status === 'stale' || v.status === 'unknown' || v.signalStrength === 'Offline') {
        return false;
      }
      return (v.lastUpdateMinutes ?? 999) <= freshnessThresholdMinutes;
    }

    const isWithinTimeThreshold = (v.lastUpdateMinutes ?? 999) <= freshnessThresholdMinutes;
    const isSignalActive = v.signalStrength !== 'Offline';
    return isWithinTimeThreshold && isSignalActive;
  }, [freshnessThresholdMinutes]);

  // Fetch vessels from API
  const fetchFleetData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const result = await vesselService.getVessels();
      setVessels((prevVessels) => {
        if (prevVessels.length === 0) return result.vessels;
        return result.vessels.map((rv) => {
          // STRICT RULE: Real GPS vessels ALWAYS use coordinates, accuracy, and telemetry received from backend!
          if (rv.isLiveGps || rv.trackingSource === 'LIVE_GPS' || !rv.isDemo) {
            return rv;
          }
          // For demo vessels, keep current animated coordinates if simulation is active
          const pv = prevVessels.find((p) => p.id === rv.id);
          if (!pv) return rv;
          return isSimulatingMotion
            ? { ...rv, coordinates: pv.coordinates, speedKnots: pv.speedKnots, headingDegrees: pv.headingDegrees }
            : rv;
        });
      });

      setSelectedVessel((prevSelected) => {
        if (!prevSelected) return result.vessels[0] || null;
        const match = result.vessels.find((v) => v.id === prevSelected.id);
        if (!match) return result.vessels[0] || null;
        if (match.isLiveGps || match.trackingSource === 'LIVE_GPS' || !match.isDemo) {
          return match;
        }
        return isSimulatingMotion && prevSelected.coordinates
          ? { ...match, coordinates: prevSelected.coordinates, speedKnots: prevSelected.speedKnots, headingDegrees: prevSelected.headingDegrees }
          : match;
      });
    } catch {
      // Handled internally without UI banners
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isSimulatingMotion]);

  useEffect(() => {
    fetchFleetData();
  }, [fetchFleetData]);

  // Subscribe to isolated GPS testing service for instant UI responsiveness upon packet ingestion
  useEffect(() => {
    const unsubscribe = gpsTestingService.subscribe((state) => {
      setGpsState(state);
      if (state.lastSuccessfulUpdate) {
        // Silently refresh fleet data so the map marker shifts without page reload
        fetchFleetData(true);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [fetchFleetData]);

  // Periodic Polling to retrieve fresh GPS telemetry from FastAPI backend every 3 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchFleetData(true);
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [fetchFleetData]);

  // Dynamic vessel coordinate updates (Simulation Mode along Maritime Corridors)
  // STRICT RULE: Real GPS vessels must NEVER have simulation movement applied!
  useEffect(() => {
    if (!isSimulatingMotion) return;

    const interval = setInterval(() => {
      setVessels((prev) =>
        prev.map((v) => {
          // STRICT RULE: Never apply artificial movement to real GPS vessels!
          // A vessel without a new GPS update must remain at its last known position.
          if (v.isLiveGps || v.trackingSource === 'LIVE_GPS' || !v.isDemo) {
            return v;
          }

          // Untrackable/offline craft do not have live position updates
          const isStale = (v.lastUpdateMinutes ?? 999) > freshnessThresholdMinutes || v.signalStrength === 'Offline';
          if (isStale || !v.coordinates) {
            return v;
          }

          const currentSpeed = v.speedKnots || 8.0;
          let currentHeading = v.headingDegrees || 90;

          // Initialize or read corridor direction reversal
          if (routeDirections.current[v.id] === undefined) {
            routeDirections.current[v.id] = 1;
          }
          const dir = routeDirections.current[v.id];

          const headingRad = (currentHeading * Math.PI) / 180;
          // Step coordinates based on velocity
          const stepSize = 0.0018 * dir;
          let nextLat = v.coordinates[0] + Math.cos(headingRad) * stepSize;
          let nextLng = v.coordinates[1] + Math.sin(headingRad) * stepSize;

          // Boundary bounce so boats remain in valid coastal corridors
          if (nextLat > GEO_BOUNDS.maxLat || nextLat < GEO_BOUNDS.minLat || nextLng > GEO_BOUNDS.maxLng || nextLng < GEO_BOUNDS.minLng) {
            routeDirections.current[v.id] = -dir;
            currentHeading = (currentHeading + 180) % 360;
            nextLat = Math.max(GEO_BOUNDS.minLat + 0.1, Math.min(GEO_BOUNDS.maxLat - 0.1, nextLat));
            nextLng = Math.max(GEO_BOUNDS.minLng + 0.1, Math.min(GEO_BOUNDS.maxLng - 0.1, nextLng));
          }

          const updatedVessel: VesselReport = {
            ...v,
            coordinates: [Number(nextLat.toFixed(4)), Number(nextLng.toFixed(4))],
            headingDegrees: Math.round(currentHeading),
            reportedLocation: `${Math.abs(nextLat).toFixed(2)}°N, ${Math.abs(nextLng).toFixed(2)}°E (${v.homePort.split(' ')[0]} corridor)`,
            lastReportedTime: 'Just now (Simulated Fix)',
            lastUpdateMinutes: 1,
          };

          // Synchronize selected vessel card
          if (selectedVessel?.id === v.id) {
            setSelectedVessel(updatedVessel);
          }

          return updatedVessel;
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulatingMotion, freshnessThresholdMinutes, selectedVessel?.id]);

  // Leaflet Marker Icon Factory
  const createVesselIconHtml = (v: VesselReport, trackable: boolean, isSelected: boolean) => {
    const heading = v.headingDegrees ?? 0;
    const bgFill = trackable ? '#ef4444' : '#1e293b';
    const borderStroke = trackable ? '#ffffff' : '#94a3b8';
    const shortName = v.boatName.split(' ')[0];

    return `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        ${isSelected ? '<div class="vessel-icon-pulse" style="position: absolute; width: 34px; height: 34px; border-radius: 50%; border: 2.5px solid ' + (trackable ? '#ef4444' : '#64748b') + '; background: ' + (trackable ? 'rgba(239, 68, 68, 0.25)' : 'rgba(100, 116, 139, 0.2)') + ';"></div>' : ''}
        <div style="transform: rotate(${heading}deg); transition: transform 0.4s ease; width: 24px; height: 24px; border-radius: 50%; background: ${bgFill}; border: 2px solid ${borderStroke}; box-shadow: 0 2px 6px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
          ${trackable ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"></polygon></svg>' : '<div style="width: 7px; height: 7px; border-radius: 50%; background: #94a3b8;"></div>'}
        </div>
        <div style="position: absolute; bottom: -14px; white-space: nowrap; font-size: 10px; font-weight: 700; color: #0f172a; background: rgba(255, 255, 255, 0.92); padding: 1px 5px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); border: 1px solid #cbd5e1; pointer-events: none;">
          ${shortName}
        </div>
      </div>
    `;
  };

  // Leaflet Marker Popup Factory
  const createVesselPopupHtml = (v: VesselReport, trackable: boolean) => {
    const typeLabel = v.vesselType || 'Fishing Vessel';
    const statusBg = trackable ? '#dcfce7' : '#fee2e2';
    const statusColor = trackable ? '#166534' : '#991b1b';
    const sourceLabel = v.trackingSource === 'LIVE_GPS'
      ? 'Live Device GPS (Field Stream)'
      : v.trackingSource === 'LIVE_AIS'
      ? 'Live Satellite AIS'
      : v.trackingSource === 'NAVIC_GPS'
      ? 'ISRO NavIC GPS'
      : 'Simulated Demo Telemetry';

    return `
      <div class="vessel-leaflet-popup" style="min-width: 230px; padding: 4px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
          <div>
            <h4 style="margin: 0; font-size: 1rem; font-weight: 800; color: #0a192f;">${v.boatName}</h4>
            <div style="font-size: 0.75rem; color: #64748b; font-family: monospace;">${v.registrationNumber}</div>
          </div>
          <span style="font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 12px; background: ${statusBg}; color: ${statusColor};">
            ${trackable ? 'Active' : 'Stale'}
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; color: #334155;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Vessel Type:</span>
            <strong>${typeLabel}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Home Port:</span>
            <span>${v.homePort}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Coordinates:</span>
            <span style="font-family: monospace; font-weight: 600;">${v.coordinates ? `${v.coordinates[0].toFixed(4)}°N, ${v.coordinates[1].toFixed(4)}°E` : 'Unavailable'}</span>
          </div>
          ${v.accuracyMeters ? `
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">GPS Accuracy:</span>
            <span style="font-weight: 700; color: #16a34a;">±${v.accuracyMeters.toFixed(1)} m</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Speed / Heading:</span>
            <span>${v.speedKnots !== null && v.speedKnots !== undefined ? `${v.speedKnots} kts • ${v.headingDegrees ?? 0}°` : 'Unavailable'}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Tracking Source:</span>
            <span style="font-size: 0.72rem; font-weight: 700; color: ${v.isLiveGps ? '#15803d' : '#0369a1'};">${sourceLabel}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1px dashed #e2e8f0; padding-top: 4px; margin-top: 2px;">
            <span style="color: #64748b;">Last Report:</span>
            <span>${v.lastReportedTime || 'Unavailable'}</span>
          </div>
        </div>
      </div>
    `;
  };

  // INITIALIZE LEAFLET MAP (Executed once on mount)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center map around Tamil Nadu & Bay of Bengal
    const map = L.map(mapContainerRef.current, {
      center: [10.20, 79.50],
      zoom: 7,
      minZoom: 5,
      maxZoom: 15,
      zoomControl: true,
    });

    // Real-world OpenStreetMap Geographical Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> | CoastalGuard AI',
      maxZoom: 18,
    }).addTo(map);

    // Create Layer Groups
    const riskGroup = L.layerGroup().addTo(map);
    const portsGroup = L.layerGroup().addTo(map);
    const vesselsGroup = L.layerGroup().addTo(map);

    riskZonesGroupRef.current = riskGroup;
    portsGroupRef.current = portsGroup;
    vesselsGroupRef.current = vesselsGroup;
    mapInstanceRef.current = map;

    // RENDER REAL COASTAL RISK ZONES
    RISK_ZONES.forEach((zone) => {
      const polygon = L.polygon(zone.coordinates, {
        color: zone.color,
        weight: 2,
        dashArray: '6, 6',
        fillColor: zone.fillColor,
        fillOpacity: zone.fillOpacity,
      });

      polygon.bindPopup(`
        <div style="font-family: inherit; font-size: 0.85rem; padding: 2px; max-width: 240px;">
          <div style="font-weight: 800; color: ${zone.color}; font-size: 0.95rem; margin-bottom: 3px;">
            ⚠️ ${zone.name}
          </div>
          <div style="font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 4px;">
            ${zone.tamilName}
          </div>
          <div style="font-size: 0.75rem; color: #b45309; font-weight: 700; margin-bottom: 4px;">
            Status: ${zone.severity}
          </div>
          <p style="margin: 0; font-size: 0.78rem; color: #475569; line-height: 1.35;">
            ${zone.description}
          </p>
        </div>
      `);

      polygon.addTo(riskGroup);
    });

    // RENDER COASTAL FISHING PORTS & HARBOURS
    mockHarbours.forEach((harbour) => {
      const portIcon = L.divIcon({
        className: 'custom-port-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #0284c7; border: 2px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 11px;">
              ⚓
            </div>
            <div style="position: absolute; bottom: -12px; white-space: nowrap; font-size: 9px; font-weight: 700; color: #0284c7; background: rgba(255, 255, 255, 0.9); padding: 0px 4px; border-radius: 3px; border: 1px solid #bae6fd; pointer-events: none;">
              ${harbour.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const portMarker = L.marker(harbour.coordinates, { icon: portIcon });
      portMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 0.85rem; padding: 2px; min-width: 210px;">
          <h4 style="margin: 0 0 2px 0; font-size: 0.95rem; font-weight: 800; color: #0369a1;">⚓ ${harbour.name}</h4>
          <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 6px;">${harbour.tamilName || ''} (${harbour.district})</div>
          <div style="display: flex; flex-direction: column; gap: 3px; font-size: 0.78rem;">
            <div><strong>Shelter Capacity:</strong> ${harbour.shelterCapacityBoats} Crafts</div>
            <div><strong>VHF Channel:</strong> ${harbour.vhfEmergencyChannel}</div>
            <div><strong>Harbour Depth:</strong> ${harbour.depthMeters} meters</div>
            <div><strong>Status:</strong> <span style="font-weight: 700; color: ${harbour.status === 'Open' ? '#16a34a' : '#d97706'}">${harbour.status}</span></div>
          </div>
        </div>
      `);

      portMarker.addTo(portsGroup);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // SYNCHRONIZE DYNAMIC VESSEL MARKERS
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = vesselsGroupRef.current;
    if (!map || !group) return;

    const currentVesselIds = new Set<string>();

    vessels.forEach((v) => {
      currentVesselIds.add(v.id);
      if (!v.coordinates || v.coordinates.length !== 2) return;

      const [lat, lng] = v.coordinates;
      const trackable = isVesselTrackable(v);
      const isSelected = selectedVessel?.id === v.id;

      const customIcon = L.divIcon({
        className: 'custom-vessel-marker',
        html: createVesselIconHtml(v, trackable, isSelected),
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      });

      let marker = vesselMarkersRef.current.get(v.id);

      if (marker) {
        // Update existing marker position smoothly without recreation
        marker.setLatLng([lat, lng]);
        marker.setIcon(customIcon);
        marker.setPopupContent(createVesselPopupHtml(v, trackable));
      } else {
        // Create marker
        marker = L.marker([lat, lng], { icon: customIcon });
        marker.bindPopup(createVesselPopupHtml(v, trackable));
        marker.on('click', () => {
          setSelectedVessel(v);
        });
        marker.addTo(group);
        vesselMarkersRef.current.set(v.id, marker);
      }
    });

    // Remove any pruned vessel markers
    vesselMarkersRef.current.forEach((marker, id) => {
      if (!currentVesselIds.has(id)) {
        group.removeLayer(marker);
        vesselMarkersRef.current.delete(id);
      }
    });

    // Follow Mode: Keep selected craft centered if user explicitly enabled it
    if (isFollowMode && selectedVessel && selectedVessel.coordinates) {
      map.panTo([selectedVessel.coordinates[0], selectedVessel.coordinates[1]], { animate: true });
    }
  }, [vessels, selectedVessel?.id, freshnessThresholdMinutes, isFollowMode, isVesselTrackable]);

  // TOGGLE RISK ZONES LAYER
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = riskZonesGroupRef.current;
    if (!map || !group) return;

    if (showRiskZones) {
      if (!map.hasLayer(group)) map.addLayer(group);
    } else {
      if (map.hasLayer(group)) map.removeLayer(group);
    }
  }, [showRiskZones]);

  // TOGGLE PORTS LAYER
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = portsGroupRef.current;
    if (!map || !group) return;

    if (showPorts) {
      if (!map.hasLayer(group)) map.addLayer(group);
    } else {
      if (map.hasLayer(group)) map.removeLayer(group);
    }
  }, [showPorts]);

  // Center on Selected Vessel
  const centerOnVessel = (v: VesselReport) => {
    setSelectedVessel(v);
    if (mapInstanceRef.current && v.coordinates) {
      mapInstanceRef.current.setView([v.coordinates[0], v.coordinates[1]], 10, { animate: true });
    }
  };

  // Reset Map View to Tamil Nadu coastal overview
  const resetMapView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([10.20, 79.50], 7, { animate: true });
    }
  };

  // Filtered vessel dataset
  const filteredVessels = vessels.filter((v) => {
    const matchesPort = filterPort === 'all' || v.homePort.toLowerCase().includes(filterPort.toLowerCase());
    const matchesSearch =
      v.boatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.mmsi && v.mmsi.includes(searchQuery));
    return matchesPort && matchesSearch;
  });

  const trackableCount = vessels.filter(isVesselTrackable).length;
  const untrackableCount = vessels.length - trackableCount;

  return (
    <AdminLayout>
      <PageHeader
        title={t('boat.title', 'Boat & Regional Monitoring')}
        subtitle={t('boat.subtitle', 'Interactive geographical vessel tracking, coastal transponder signal freshness, and maritime safety corridor map.')}
        badge="Live GIS Console"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {/* Real GPS Field Testing Tool Trigger */}
            <button
              onClick={() => setShowGpsTestingTool(!showGpsTestingTool)}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                backgroundColor: showGpsTestingTool || gpsState.isTracking ? 'rgba(2, 132, 199, 0.12)' : 'transparent',
                borderColor: showGpsTestingTool || gpsState.isTracking ? '#0284c7' : 'var(--color-border-subtle)',
                color: showGpsTestingTool || gpsState.isTracking ? '#0284c7' : 'var(--color-navy-primary)',
                fontWeight: 700,
              }}
              title="Test real device GPS collection without modifying the Fisherman Portal"
            >
              <Radio size={13} className={gpsState.isTracking ? 'animate-pulse' : ''} />
              <span>{gpsState.isTracking ? '📡 Live GPS Active' : '📡 Real GPS Tester'}</span>
            </button>

            {/* Play/Pause Motion */}
            <button
              onClick={() => setIsSimulatingMotion(!isSimulatingMotion)}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                backgroundColor: isSimulatingMotion ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                borderColor: isSimulatingMotion ? '#86efac' : 'var(--color-border-subtle)',
              }}
              title="Toggle vessel motion tracking"
            >
              {isSimulatingMotion ? <Pause size={13} color="#16a34a" /> : <Play size={13} color="#64748b" />}
              <span>{isSimulatingMotion ? 'Tracking: Live Motion' : 'Tracking: Paused'}</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => fetchFleetData(false)}
              disabled={isRefreshing}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              title="Reload vessel telemetry"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{t('status.refresh_now', 'Refresh Now')}</span>
            </button>
          </div>
        }
      />

      {/* ISOLATED REAL GPS FIELD TESTING TOOL */}
      {showGpsTestingTool && (
        <div
          className="card-base"
          style={{
            padding: 'var(--space-5)',
            marginBottom: 'var(--space-6)',
            backgroundColor: '#f8fafc',
            border: '2px solid #0284c7',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 16px rgba(2, 132, 199, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: gpsState.isTracking ? '#16a34a' : '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Radio size={20} className={gpsState.isTracking ? 'animate-pulse' : ''} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-navy-primary)', margin: 0 }}>
                    Actual Device GPS Telemetry Testing Console
                  </h4>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: gpsState.isTracking ? '#dcfce7' : gpsState.error ? '#fee2e2' : '#e0f2fe',
                      color: gpsState.isTracking ? '#15803d' : gpsState.error ? '#991b1b' : '#0369a1',
                      border: `1px solid ${gpsState.isTracking ? '#86efac' : gpsState.error ? '#fca5a5' : '#7dd3fc'}`,
                    }}
                  >
                    {gpsState.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                  Streams real hardware GPS fixes from browser Geolocation API directly to FastAPI <code>/api/vessels/telemetry/ingest</code> without altering Fisherman Portal code.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {/* Target Test Vessel Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Target Craft:</span>
                <select
                  value={testVesselId}
                  disabled={gpsState.isTracking}
                  onChange={(e) => setTestVesselId(e.target.value)}
                  style={{
                    padding: '0.35rem 0.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--color-navy-primary)',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="vessel-gps-test">Kadal Kural (GPS Test Craft)</option>
                  {vessels.filter((v) => v.id !== 'vessel-gps-test').map((v) => (
                    <option key={v.id} value={v.id}>{v.boatName} ({v.id})</option>
                  ))}
                </select>
              </div>

              {/* Start / Stop Stream Buttons */}
              {!gpsState.isTracking ? (
                <button
                  onClick={() => gpsTestingService.startTracking(testVesselId)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                >
                  <Play size={13} />
                  <span>Start GPS Stream</span>
                </button>
              ) : (
                <button
                  onClick={() => gpsTestingService.stopTracking()}
                  className="btn btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', backgroundColor: '#dc2626', color: '#ffffff', border: '1px solid #b91c1c' }}
                >
                  <Pause size={13} />
                  <span>Stop GPS Stream</span>
                </button>
              )}

              <button
                onClick={() => setShowGpsTestingTool(false)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Hide Console
              </button>
            </div>
          </div>

          {/* Real-Time Device Telemetry Readouts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{ padding: '0.55rem 0.75rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Active Fix Coordinates</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--color-navy-primary)', marginTop: '2px' }}>
                {gpsState.lastCoordinates ? `${gpsState.lastCoordinates[0].toFixed(5)}°N, ${gpsState.lastCoordinates[1].toFixed(5)}°E` : 'Awaiting GPS Fix...'}
              </div>
            </div>

            <div style={{ padding: '0.55rem 0.75rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>GPS Accuracy (Meters)</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: gpsState.accuracyMeters && gpsState.accuracyMeters <= 15 ? '#15803d' : '#0369a1', marginTop: '2px' }}>
                {gpsState.accuracyMeters !== null ? `±${gpsState.accuracyMeters.toFixed(1)} meters` : 'Unavailable'}
              </div>
            </div>

            <div style={{ padding: '0.55rem 0.75rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Device Speed & Heading</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy-primary)', marginTop: '2px' }}>
                {gpsState.speedKnots !== null ? `${gpsState.speedKnots} kts` : 'Stationary'} • {gpsState.headingDegrees !== null ? `${gpsState.headingDegrees}°` : 'N/A'}
              </div>
            </div>

            <div style={{ padding: '0.55rem 0.75rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Packets Ingested</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                {gpsState.successfulPackets} sent ({gpsState.lastSuccessfulUpdate ? 'Live' : 'Pending'})
              </div>
            </div>

            <div style={{ padding: '0.55rem 0.75rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Server Ingest Receipt</span>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '3px' }}>
                {gpsState.lastSuccessfulUpdate || 'No packet acknowledged yet'}
              </div>
            </div>
          </div>

          {/* Error Banner if any */}
          {gpsState.error && (
            <div style={{ padding: '0.55rem 0.85rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#991b1b', fontSize: '0.8rem', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color="#dc2626" />
              <span><strong>GPS Error:</strong> {gpsState.error}</span>
            </div>
          )}

          {/* Strict Technical Disclaimers & Hardware Constraints */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)', fontSize: '0.76rem', color: '#475569' }}>
            <div style={{ padding: '0.5rem 0.65rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-sm)', border: '1px solid #bfdbfe' }}>
              <strong style={{ color: '#1e40af', display: 'block', marginBottom: '2px' }}>
                📍 Land Testing Notice
              </strong>
              Browser GPS uses this testing device's actual physical coordinates. A land-based test reflects the tester's physical location (office, desk, or lab) and does NOT represent an actual fishing vessel at sea.
            </div>

            <div style={{ padding: '0.5rem 0.65rem', backgroundColor: '#fefce8', borderRadius: 'var(--radius-sm)', border: '1px solid #fde047' }}>
              <strong style={{ color: '#854d0e', display: 'block', marginBottom: '2px' }}>
                🔋 Browser Tab Suspension Limitation
              </strong>
              Web browsers throttle or suspend <code>navigator.geolocation.watchPosition</code> when this tab is closed, minimized, or backgrounded. Production vessel tracking will run via dedicated onboard transponder hardware or foreground Fisherman PWA service.
            </div>

            <div style={{ padding: '0.5rem 0.65rem', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1' }}>
              <strong style={{ color: '#334155', display: 'block', marginBottom: '2px' }}>
                💾 Backend In-Memory Storage Prototype
              </strong>
              Telemetry is accepted in FastAPI backend in-memory cache without modifying the database schema. Data resets when the backend server process restarts. Permanent PostgreSQL storage will connect once User Portal is integrated.
            </div>
          </div>
        </div>
      )}

      {/* Main Map & Vessel Telemetry Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {/* Interactive Geographical Map Card */}
        <div className="card-base" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column' }}>
          {/* Map Top Bar with Layer Controls and Tiny Inline Legend */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                  {t('boat.map_title', 'Regional Vessel Presence Map (Live Interactive GIS)')}
                </h3>
                {/* Tiny, unobtrusive legend that does NOT cover the map */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#b91c1c' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                    Trackable ({trackableCount})
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#374151' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#111827', border: '1px solid #ffffff', display: 'inline-block' }} />
                    Untrackable ({untrackableCount})
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0369a1' }}>
                    <span>⚓</span> Ports ({mockHarbours.length})
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#b45309' }}>
                    <span>⚠️</span> Risk Zones ({RISK_ZONES.length})
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {t('boat.map_sub', 'Real OpenStreetMap geographical view of Tamil Nadu coast, Bay of Bengal & Gulf of Mannar')}
              </p>
            </div>

            {/* Quick Map Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {/* Follow Craft Toggle */}
              <button
                onClick={() => setIsFollowMode(!isFollowMode)}
                className="btn btn-outline btn-sm"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  backgroundColor: isFollowMode ? '#eff6ff' : 'transparent',
                  borderColor: isFollowMode ? '#3b82f6' : 'var(--color-border-subtle)',
                  color: isFollowMode ? '#1d4ed8' : 'var(--color-navy-primary)',
                  fontWeight: 600,
                }}
                title="Automatically pan map to track selected vessel"
              >
                <Crosshair size={12} />
                <span>{isFollowMode ? 'Following Vessel' : 'Follow Vessel'}</span>
              </button>

              {/* Reset Map View */}
              <button
                onClick={resetMapView}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                title="Reset map view to Tamil Nadu overview"
              >
                <RotateCcw size={12} />
                <span>Reset View</span>
              </button>

              {/* Freshness Threshold Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', backgroundColor: 'var(--color-bg-alt)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <Sliders size={12} color="var(--color-ocean-blue)" />
                <label htmlFor="freshness-select" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                  Freshness:
                </label>
                <select
                  id="freshness-select"
                  value={freshnessThresholdMinutes}
                  onChange={(e) => setFreshnessThresholdMinutes(Number(e.target.value))}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.1rem 0.3rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-subtle)',
                    fontWeight: 600,
                    color: 'var(--color-navy-primary)',
                  }}
                >
                  <option value={15}>15 {language === 'ta' ? 'நிமிடம்' : 'mins'}</option>
                  <option value={30}>30 {language === 'ta' ? 'நிமிடம்' : 'mins'}</option>
                  <option value={60}>60 {language === 'ta' ? 'நிமிடம்' : 'mins'}</option>
                  <option value={120}>120 {language === 'ta' ? 'நிமிடம்' : 'mins'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Map Filter Bar (Layer toggles) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 'var(--space-2)', fontSize: '0.75rem', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Layers size={13} color="var(--color-ocean-blue)" /> Overlays:
              </span>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showRiskZones}
                  onChange={(e) => setShowRiskZones(e.target.checked)}
                />
                <span>Risk & Danger Corridors</span>
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showPorts}
                  onChange={(e) => setShowPorts(e.target.checked)}
                />
                <span>Designated Fishing Ports</span>
              </label>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              Drag to pan • Scroll to zoom • Click markers for details
            </div>
          </div>

          {/* REAL LEAFLET MAP CONTAINER */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '460px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid #cbd5e1',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div
              ref={mapContainerRef}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* INTERACTIVE VESSEL TELEMETRY CARD */}
        <div className="card-base" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={20} color="var(--color-ocean-blue)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                  {t('boat.telemetry_card_title', 'Vessel Telemetry Card')}
                </h3>
              </div>
              {selectedVessel && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isVesselTrackable(selectedVessel) ? '#fee2e2' : '#f3f4f6',
                    color: isVesselTrackable(selectedVessel) ? '#dc2626' : '#111827',
                    border: `1px solid ${isVesselTrackable(selectedVessel) ? '#fca5a5' : '#d1d5db'}`,
                  }}
                >
                  {isVesselTrackable(selectedVessel) ? '🔴 Trackable' : '⚫ Untrackable'}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              {t('boat.telemetry_card_sub', 'Click any vessel marker or table row to inspect details')}
            </p>

            {selectedVessel ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {/* Vessel Identity Pill */}
                <div style={{ padding: '0.65rem 0.75rem', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                        {selectedVessel.boatName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                        Reg: {selectedVessel.registrationNumber} {selectedVessel.mmsi ? `• MMSI: ${selectedVessel.mmsi}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => centerOnVessel(selectedVessel)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem' }}
                      title="Focus on vessel on the map"
                    >
                      <Crosshair size={12} />
                      <span>Focus</span>
                    </button>
                  </div>
                </div>

                {/* Vessel Classification */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Vessel Classification:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-ocean-blue)' }}>{selectedVessel.vesselType || 'Fishing Trawler'}</span>
                </div>

                {/* Master / Owner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('boat.lbl_owner', 'Master / Owner:')}</span>
                  <span style={{ fontWeight: 600 }}>{selectedVessel.ownerName}</span>
                </div>

                {/* Home Port */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('boat.lbl_homeport', 'Home Port:')}</span>
                  <span style={{ fontWeight: 600 }}>{selectedVessel.homePort}</span>
                </div>

                {/* Reported Geographic Location */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('boat.lbl_reported_loc', 'Reported Location:')}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-ocean-blue)', textAlign: 'right', fontSize: '0.8rem' }}>
                    {selectedVessel.reportedLocation || 'Unavailable'}
                  </span>
                </div>

                {/* Dynamic GPS Coordinates */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('boat.lbl_coordinates', 'Coordinates:')}</span>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-navy-primary)' }}>
                    {selectedVessel.coordinates ? `${selectedVessel.coordinates[0].toFixed(5)}°N, ${selectedVessel.coordinates[1].toFixed(5)}°E` : 'Unavailable'}
                  </span>
                </div>

                {/* GPS Accuracy if available */}
                {selectedVessel.accuracyMeters !== undefined && selectedVessel.accuracyMeters !== null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>GPS Accuracy:</span>
                    <span style={{ fontWeight: 700, color: '#16a34a' }}>
                      ±{selectedVessel.accuracyMeters.toFixed(1)} meters
                    </span>
                  </div>
                )}

                {/* Speed */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('boat.lbl_speed', 'Reported Speed:')}</span>
                  {selectedVessel.speedKnots !== null && selectedVessel.speedKnots !== undefined && isVesselTrackable(selectedVessel) ? (
                    <span style={{ fontWeight: 700, color: '#0369a1' }}>{selectedVessel.speedKnots} knots</span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', backgroundColor: '#fef3c7', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                      {selectedVessel.speedKnots ? `${selectedVessel.speedKnots} kts (${t('boat.val_outdated', 'Outdated')})` : t('boat.val_unavailable', 'Unavailable')}
                    </span>
                  )}
                </div>

                {/* Heading */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('boat.lbl_heading', 'Compass Heading:')}</span>
                  {selectedVessel.headingDegrees !== null && selectedVessel.headingDegrees !== undefined && isVesselTrackable(selectedVessel) ? (
                    <span style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Navigation size={12} style={{ transform: `rotate(${selectedVessel.headingDegrees}deg)` }} />
                      {selectedVessel.headingDegrees}°
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', backgroundColor: '#fef3c7', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                      {selectedVessel.headingDegrees ? `${selectedVessel.headingDegrees}° (${t('boat.val_outdated', 'Outdated')})` : t('boat.val_unavailable', 'Unavailable')}
                    </span>
                  )}
                </div>

                {/* Server Ingest Timestamp if available */}
                {selectedVessel.serverReceivedAt && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Server Ingested:</span>
                    <span style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--color-navy-primary)' }}>
                      {selectedVessel.serverReceivedAt}
                    </span>
                  </div>
                )}

                {/* Device Timestamp if available */}
                {selectedVessel.deviceTimestamp && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Device Timestamp:</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                      {selectedVessel.deviceTimestamp}
                    </span>
                  </div>
                )}

                {/* Tracking Data Source */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Tracking Source:</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)', backgroundColor: selectedVessel.isLiveGps ? '#dcfce7' : '#fef3c7', color: selectedVessel.isLiveGps ? '#15803d' : '#b45309' }}>
                    {selectedVessel.trackingSource === 'LIVE_GPS' ? 'Live GPS (Field Telemetry)' : selectedVessel.trackingSource === 'LIVE_AIS' ? 'Live Satellite AIS' : selectedVessel.trackingSource === 'NAVIC_GPS' ? 'ISRO NavIC GPS' : 'Simulated Demo'}
                  </span>
                </div>

                {/* Transponder Signal Strength */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', paddingTop: '0.2rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{t('boat.lbl_signal', 'Transponder Signal:')}</span>
                  <StatusBadge status={selectedVessel.status} size="sm" />
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {t('boat.select_prompt', 'Select a craft on the map or table to review coordinates and transponder health.')}
              </p>
            )}
          </div>

          {/* Telemetry Authenticity Note & Provider Readiness */}
          <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ padding: '0.55rem 0.75rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)', fontSize: '0.75rem', color: '#64748b' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-navy-primary)' }}>Tracking Mode: </span>
              Coordinates dynamically animate along verified Tamil Nadu fishing corridors.
            </div>

            <button
              onClick={() => setShowIntegrationGuide(!showIntegrationGuide)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.72rem', justifyContent: 'space-between', width: '100%', padding: '0.35rem 0.65rem' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Info size={13} color="var(--color-ocean-blue)" />
                <span>Live AIS / GPS Provider Architecture</span>
              </span>
              <span>{showIntegrationGuide ? 'Hide ▲' : 'Details ▼'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AIS / GPS LIVE PROVIDER ARCHITECTURE DRAWER */}
      {showIntegrationGuide && (
        <div className="card-base" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-ocean-blue)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                  Live AIS & GPS Integration Architecture
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                  Transparent telemetry protocol: How CoastalGuard AI connects real vessels vs authorized artisanal craft
                </p>
              </div>
            </div>
            <button onClick={() => setShowIntegrationGuide(false)} className="btn btn-outline btn-sm" style={{ fontSize: '0.75rem' }}>
              Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)', fontSize: '0.85rem' }}>
            <div style={{ padding: 'var(--space-4)', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <strong style={{ color: 'var(--color-navy-primary)', display: 'block', marginBottom: '4px' }}>
                1. Satellite & Terrestrial AIS Integration
              </strong>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                For mechanized trawlers and commercial ships equipped with Class A/B AIS transponders, live telemetry streams via <code>AISStream.io</code> or <code>AISHub</code>. Set <code>AIS_API_KEY</code> in the backend environment to activate live satellite streaming for the Tamil Nadu bounding box (7.5°N–14.0°N, 77.0°E–81.0°E).
              </p>
            </div>

            <div style={{ padding: 'var(--space-4)', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <strong style={{ color: 'var(--color-navy-primary)', display: 'block', marginBottom: '4px' }}>
                2. Consent-Based Artisanal Fishermen GPS
              </strong>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                Traditional catamarans and small motorboats do not carry costly AIS transponders. CoastalGuard AI supports authorized onboard NavIC transponders (ISRO MSS) or consent-based mobile emergency GPS check-ins via <code>POST /api/vessels/telemetry/ingest</code> without fabricating personal coordinates.
              </p>
            </div>

            <div style={{ padding: 'var(--space-4)', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
              <strong style={{ color: 'var(--color-navy-primary)', display: 'block', marginBottom: '4px' }}>
                3. Vessel Classification & Freshness
              </strong>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                Vessels are classified by registered category (Mechanized Trawler, Fiber Motorboat, Traditional Catamaran). Beacons are dynamically flagged as Trackable (within freshness threshold) or Untrackable (stale/offline) to prevent treating outdated fixes as active GPS readings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC FLEET LOCATION REPORTS TABLE */}
      <div className="card-base" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
              {t('boat.reports_title', 'Regional Fleet Location Reports')} ({filteredVessels.length} {language === 'ta' ? 'பதிவுகள்' : 'crafts'})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {t('boat.reports_sub', 'Vessel positions and transponder telemetry across monitored fishing ports')}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder={t('boat.search_placeholder', 'Search boat, owner, or reg no...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '0.85rem',
                  minWidth: '220px',
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
              <option value="all">{t('boat.all_ports', 'All Home Ports')}</option>
              <option value="Rameswaram">Rameswaram</option>
              <option value="Kasimedu">Kasimedu (Chennai)</option>
              <option value="Tuticorin">Tuticorin</option>
              <option value="Chinnamuttam">Chinnamuttam (Kanyakumari)</option>
              <option value="Nagapattinam">Nagapattinam</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto var(--space-2)' }} />
            <div>{t('status.loading', 'Loading fleet telemetry...')}</div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredVessels.length === 0 && (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
            <Compass size={32} color="var(--color-text-muted)" style={{ margin: '0 auto var(--space-2)' }} />
            <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)' }}>
              {t('status.no_records', 'No matching vessels found')}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Try adjusting the harbour filter or search terms.
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && filteredVessels.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border-light)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>{t('boat.th_boat', 'Boat & Reg Number')}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Classification</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{t('boat.th_owner', 'Owner / Skipper')}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{t('boat.th_harbour', 'Home Harbour')}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>GPS Coordinates</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Speed & Heading</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Data Source</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{t('boat.th_status', 'Tracking Status')}</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{t('boat.th_action', 'Action')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredVessels.map((v) => {
                  const trackable = isVesselTrackable(v);
                  const isSelected = selectedVessel?.id === v.id;

                  return (
                    <tr
                      key={v.id}
                      style={{
                        borderBottom: '1px solid var(--color-border-light)',
                        backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      onClick={() => centerOnVessel(v)}
                    >
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)' }}>{v.boatName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                          {v.registrationNumber} {v.mmsi ? `(MMSI: ${v.mmsi})` : ''}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-ocean-blue)' }}>
                        {v.vesselType || 'Fishing Trawler'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>{v.ownerName}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{v.homePort}</td>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-navy-primary)' }}>
                        {v.coordinates ? `${v.coordinates[0].toFixed(4)}°, ${v.coordinates[1].toFixed(4)}°` : '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
                        {v.speedKnots !== null && v.speedKnots !== undefined ? (
                          <div>
                            <strong>{v.speedKnots} kts</strong> • {v.headingDegrees ?? 0}°
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                            Unavailable
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)', backgroundColor: v.isLiveGps ? '#dcfce7' : '#fef3c7', color: v.isLiveGps ? '#15803d' : '#92400e' }}>
                          {v.trackingSource === 'LIVE_GPS' ? 'Live GPS' : v.trackingSource === 'LIVE_AIS' ? 'Live AIS' : v.trackingSource === 'NAVIC_GPS' ? 'NavIC GPS' : 'Simulated Demo'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: trackable ? '#fee2e2' : '#f3f4f6',
                            color: trackable ? '#b91c1c' : '#1f2937',
                            border: `1px solid ${trackable ? '#fca5a5' : '#d1d5db'}`,
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              backgroundColor: trackable ? '#ef4444' : '#111827',
                            }}
                          />
                          <span>{trackable ? 'Trackable' : 'Untrackable'}</span>
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            centerOnVessel(v);
                          }}
                          className="btn btn-outline btn-sm"
                          style={{
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.75rem',
                            borderColor: isSelected ? 'var(--color-ocean-blue)' : 'var(--color-border-subtle)',
                          }}
                        >
                          Focus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
