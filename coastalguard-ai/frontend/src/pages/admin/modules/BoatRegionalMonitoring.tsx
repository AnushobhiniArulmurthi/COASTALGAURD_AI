import React, { useState } from 'react';
import {
  Compass,
  Radio,
  AlertTriangle,
  Search,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { mockVessels } from '../../../data/mockData';
import type { VesselReport } from '../../../types';

export const BoatRegionalMonitoring: React.FC = () => {
  const [filterPort, setFilterPort] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVessel, setSelectedVessel] = useState<VesselReport | null>(mockVessels[0]);

  const filteredVessels = mockVessels.filter((vessel) => {
    const matchesPort =
      filterPort === 'all' || vessel.homePort.toLowerCase().includes(filterPort.toLowerCase());
    const matchesSearch =
      vessel.boatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vessel.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vessel.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPort && matchesSearch;
  });

  return (
    <AdminLayout>
      <PageHeader
        title="Boat & Regional Monitoring"
        subtitle="Regional fleet presence overview, coastal transponder signal freshness, and sample vessel beacons."
        badge="Prototype — integration pending"
        action={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <span className="badge-prototype" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}>
              <Radio size={12} /> Fleet Telemetry Mock
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
          <strong>Disclaimer:</strong> Fictional demonstration vessels and coordinates are shown for architectural review. Actual satellite AIS transponders and coastal VHF beacons are not connected in this frontend prototype.
        </div>
      </div>

      {/* Top Map Schematic & Selection Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {/* Schematic Coastal Vector Map */}
        <div className="card-base" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                Regional Vessel Presence Map (Schematic)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Sample positions along Tamil Nadu coastline and Gulf of Mannar
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="badge-prototype">
                <Sparkles size={11} /> Interactive Plot
              </span>
            </div>
          </div>

          {/* SVG Maritime Grid Map */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '320px',
              backgroundColor: '#0a192f',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid #1e3a5f',
            }}
          >
            <svg
              viewBox="0 0 600 320"
              style={{ width: '100%', height: '100%' }}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Radar Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#162e4f" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="600" height="320" fill="url(#grid)" />

              {/* Coastline Contour (Stylized South-East India Coastline) */}
              <path
                d="M 160 0 Q 180 60 190 110 T 210 180 Q 230 220 180 250 T 140 320 L 0 320 L 0 0 Z"
                fill="#112240"
                stroke="#233554"
                strokeWidth="2"
              />
              <text x="50" y="80" fill="#64748b" fontSize="12" fontWeight="700">LAND MASS (TN)</text>
              <text x="50" y="100" fill="#475569" fontSize="9">Mainland India</text>

              {/* Coastal Harbours */}
              <circle cx="190" cy="80" r="4" fill="#38bdf8" />
              <text x="200" y="84" fill="#94a3b8" fontSize="10">Kasimedu (Chennai)</text>

              <circle cx="210" cy="180" r="4" fill="#38bdf8" />
              <text x="220" y="184" fill="#94a3b8" fontSize="10">Nagapattinam</text>

              <circle cx="215" cy="235" r="5" fill="#2dd4bf" />
              <text x="226" y="239" fill="#2dd4bf" fontSize="10" fontWeight="700">Rameswaram Harbour</text>

              <circle cx="170" cy="275" r="4" fill="#38bdf8" />
              <text x="180" y="279" fill="#94a3b8" fontSize="10">Tuticorin</text>

              <circle cx="140" cy="310" r="4" fill="#ef4444" />
              <text x="150" y="312" fill="#fca5a5" fontSize="10">Kanyakumari (Red Zone)</text>

              {/* Danger Zone Polygon in Gulf of Mannar */}
              <polygon
                points="230,230 380,240 360,290 200,285"
                fill="rgba(239, 68, 68, 0.15)"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x="270" y="265" fill="#f87171" fontSize="10" fontWeight="700">
                GALE SWELL CAUTION (SECTOR 4)
              </text>

              {/* Plot Mock Vessels */}
              {mockVessels.map((v, i) => {
                // Map coordinates roughly onto SVG box
                const positions = [
                  { x: 300, y: 225 }, // Kadalarasan
                  { x: 260, y: 75 },  // Meenatchi Ambal
                  { x: 240, y: 275 }, // Alai Osai II
                  { x: 190, y: 310 }, // Sea Queen Voyager
                  { x: 330, y: 240 }, // Thirumalai Star
                  { x: 280, y: 175 }, // Cauvery Matha
                ];
                const pos = positions[i] || { x: 250, y: 150 };
                const isSelected = selectedVessel?.id === v.id;
                const markerColor =
                  v.status === 'sample' ? '#10b981' : v.status === 'stale' ? '#f59e0b' : '#ef4444';

                return (
                  <g
                    key={v.id}
                    onClick={() => setSelectedVessel(v)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isSelected && (
                      <circle cx={pos.x} cy={pos.y} r="14" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
                    )}
                    <circle cx={pos.x} cy={pos.y} r="6" fill={markerColor} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={pos.x + 10} y={pos.y + 4} fill="#ffffff" fontSize="9" fontWeight="600">
                      {v.boatName.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                backgroundColor: 'rgba(11, 25, 44, 0.9)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: '#ffffff',
                border: '1px solid #1e3a5f',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '2px' }}>Vessel Beacon Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Sample Synced (&lt; 30m)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span>Stale Transponder (&gt; 2h)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span>Unknown / Offline Signal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Vessel Inspector Card */}
        <div className="card-base" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2)' }}>
              <Compass size={20} color="var(--color-ocean-blue)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                Vessel Telemetry Card
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              Click any vessel on the map or table to inspect details
            </p>

            {selectedVessel ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                    {selectedVessel.boatName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Registration: {selectedVessel.registrationNumber}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Master / Owner:</span>
                  <span style={{ fontWeight: 600 }}>{selectedVessel.ownerName}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Home Port:</span>
                  <span style={{ fontWeight: 600 }}>{selectedVessel.homePort}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Reported Location:</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-ocean-blue)' }}>{selectedVessel.reportedLocation}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Signal Freshness:</span>
                  <span style={{ fontWeight: 600 }}>{selectedVessel.lastReportedTime}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', paddingTop: '0.2rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Beacon Status:</span>
                  <StatusBadge status={selectedVessel.status} size="sm" />
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Select a craft to review coordinates and transponder health.
              </p>
            )}
          </div>

          <div style={{ marginTop: 'var(--space-4)', padding: '0.65rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', fontSize: '0.75rem', color: '#166534' }}>
            ✓ Transponder integrity check passed (Simulation).
          </div>
        </div>
      </div>

      {/* Filterable Vessel Table */}
      <div className="card-base" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
              Regional Fleet Location Reports
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Mock vessel positions across monitored fishing ports
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search boat or reg no..."
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
              <option value="all">All Home Ports</option>
              <option value="Rameswaram">Rameswaram</option>
              <option value="Kasimedu">Kasimedu (Chennai)</option>
              <option value="Tuticorin">Tuticorin</option>
              <option value="Chinnamuttam">Chinnamuttam (Kanyakumari)</option>
              <option value="Nagapattinam">Nagapattinam</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border-light)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Boat & Reg Number</th>
                <th style={{ padding: '0.75rem 1rem' }}>Owner / Skipper</th>
                <th style={{ padding: '0.75rem 1rem' }}>Home Harbour</th>
                <th style={{ padding: '0.75rem 1rem' }}>Reported Location</th>
                <th style={{ padding: '0.75rem 1rem' }}>Last Reported</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVessels.map((v) => (
                <tr
                  key={v.id}
                  style={{
                    borderBottom: '1px solid var(--color-border-light)',
                    backgroundColor: selectedVessel?.id === v.id ? 'rgba(2, 132, 199, 0.06)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedVessel(v)}
                >
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)' }}>{v.boatName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{v.registrationNumber}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{v.ownerName}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{v.homePort}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
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
                        setSelectedVessel(v);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      Inspect
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
