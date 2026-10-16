import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  AlertTriangle,
  Radio,
  Users,
  ArrowRight,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Clock,
  Eye,
  Info
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { mockMarineConditions, mockAlerts } from '../../data/mockData';
import styles from './AdminDashboard.module.css';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const marineEntries = Object.values(mockMarineConditions);
  const activeAlerts = mockAlerts.filter((a) => a.isActive);

  return (
    <AdminLayout>
      <PageHeader
        title="Admin Overview"
        subtitle="High-level command telemetry, active advisories, and regional fishing craft status."
        badge="Prototype — integration pending"
        action={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Link to="/admin/risk-alerts" className="btn btn-primary btn-sm">
              <ShieldAlert size={16} />
              <span>Broadcast Alert</span>
            </Link>
          </div>
        }
      />

      {/* Global Prototype Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginBottom: 'var(--space-6)',
          fontSize: '0.85rem',
          color: '#1e40af',
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>College Review Demonstration Note:</strong> All values, telemetry trends, and vessel beacons displayed below are generated sample values. Real satellite and radar data feeds will be connected during backend integration.
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className={styles.dashboardGrid}>
        <StatCard
          title="Coastal Regions Monitored"
          value="5"
          unit="Sectors"
          subtitle="Tamil Nadu & Coromandel Zone"
          icon={<Compass size={22} />}
          accentColor="var(--color-navy-primary)"
          onClick={() => navigate('/admin/marine-monitoring')}
        />

        <StatCard
          title="Active Marine Warnings"
          value={activeAlerts.length}
          unit="Bulletins"
          subtitle="1 Extreme • 1 High • 1 Moderate"
          icon={<AlertTriangle size={22} />}
          accentColor="var(--color-danger)"
          trend={{ value: '3 Active Now', isPositive: false }}
          onClick={() => navigate('/admin/risk-alerts')}
        />

        <StatCard
          title="Boats with Location Reports"
          value="148"
          unit="Vessels"
          subtitle="6 sample transponders online"
          icon={<Radio size={22} />}
          accentColor="var(--color-teal)"
          trend={{ value: '+12 from yesterday', isPositive: true }}
          onClick={() => navigate('/admin/boat-monitoring')}
        />

        <StatCard
          title="Registered Fishermen"
          value="1,420"
          unit="Users"
          subtitle="Enrolled across 5 coastal ports"
          icon={<Users size={22} />}
          accentColor="var(--color-ocean-blue)"
          onClick={() => navigate('/admin/users')}
        />
      </div>

      {/* Two Column Section */}
      <div className={styles.twoColumnGrid}>
        {/* Marine Conditions Overview */}
        <div className="card-base" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                Marine Conditions Overview
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Sample oceanographic readings across primary fishing zones
              </p>
            </div>
            <Link to="/admin/marine-monitoring" className="btn btn-outline btn-sm">
              <span>Detailed Telemetry</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Region / Sector</th>
                  <th>Wave Height</th>
                  <th>Wind Velocity</th>
                  <th>Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {marineEntries.map((region) => (
                  <tr key={region.regionId}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy-primary)' }}>
                        {region.regionName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {region.coastalZone}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {region.waveHeightMeters}m
                      </span>{' '}
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        ({region.swellPeriodSeconds}s swell)
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{region.windSpeedKnots} kts</span>{' '}
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {region.windDirection.split(' ')[0]}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={region.riskLevel} size="sm" />
                    </td>
                    <td>
                      <Link
                        to="/admin/marine-monitoring"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Activity & Service Feeds Status */}
        <div className="card-base" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2)' }}>
              <Activity size={18} color="var(--color-ocean-blue)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                Telemetry Infrastructure
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              Integrated satellite and shore radar interface status
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--color-bg-alt)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Coastal Radar Link</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Chennai & Karaikal Doppler</div>
                </div>
                <span className="badge-prototype" style={{ backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}>
                  <CheckCircle2 size={12} /> Simulated
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--color-bg-alt)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>VHF Emergency Channel 16</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Continuous Watch Stand</div>
                </div>
                <span className="badge-prototype" style={{ backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}>
                  <CheckCircle2 size={12} /> Active
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--color-bg-alt)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>INCOIS Swell Model Sync</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Updated 8 mins ago</div>
                </div>
                <span className="badge-prototype">
                  <Clock size={12} /> Sample
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-light)' }}>
            <Link to="/admin/boat-monitoring" className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>View Fleet Tracker</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Safety Alerts Section */}
      <div className="card-base" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
              Recent Safety Alerts & Announcements
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Official warnings currently active on fisherman safety portals
            </p>
          </div>
          <Link to="/admin/risk-alerts" className="btn btn-outline btn-sm">
            <span>Manage All Alerts</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-surface-muted)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <StatusBadge status={alert.severity} size="sm" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {alert.issuedAt}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: '0.25rem' }}>
                  {alert.title}
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  {alert.message}
                </p>
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  borderTop: '1px dashed var(--color-border-subtle)',
                  paddingTop: '0.4rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Region: {alert.coastalRegion}</span>
                <span>Ref: {alert.bulletinId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
