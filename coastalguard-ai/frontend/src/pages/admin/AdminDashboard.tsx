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
import { useLanguage } from '../../i18n/LanguageContext';
import styles from './AdminDashboard.module.css';

export const AdminDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const marineEntries = Object.values(mockMarineConditions);
  const activeAlerts = mockAlerts.filter((a) => a.isActive);

  return (
    <AdminLayout>
      <PageHeader
        title={t('admin.overviewTitle')}
        subtitle={t('admin.overviewSubtitle')}
        badge={t('common.prototypeBadge')}
        action={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Link to="/admin/risk-alerts" className="btn btn-primary btn-sm">
              <ShieldAlert size={16} />
              <span>{t('admin.broadcastAlert')}</span>
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
          <strong>{language === 'ta' ? 'கல்லூரி மதிப்பாய்வு குறிப்பு:' : 'Demonstration Note:'}</strong>{' '}
          {t('admin.prototypeNotice')}
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className={styles.dashboardGrid}>
        <StatCard
          title={t('admin.statRegions')}
          value="5"
          unit={t('hero.metricSectors')}
          subtitle={t('admin.statRegionsSub')}
          icon={<Compass size={22} />}
          accentColor="var(--color-navy-primary)"
          onClick={() => navigate('/admin/marine-monitoring')}
        />

        <StatCard
          title={t('admin.statAlerts')}
          value={activeAlerts.length}
          unit={language === 'ta' ? 'அறிக்கைகள்' : 'Bulletins'}
          subtitle={t('admin.statAlertsSub')}
          icon={<AlertTriangle size={22} />}
          accentColor="var(--color-danger)"
          trend={{ value: language === 'ta' ? '3 எச்சரிக்கைகள்' : '3 Active Now', isPositive: false }}
          onClick={() => navigate('/admin/risk-alerts')}
        />

        <StatCard
          title={t('admin.statBoats')}
          value="148"
          unit={t('fisherman.crafts')}
          subtitle={t('admin.statBoatsSub')}
          icon={<Radio size={22} />}
          accentColor="var(--color-teal)"
          trend={{ value: language === 'ta' ? '+12 நேற்றையிலிருந்து' : '+12 from yesterday', isPositive: true }}
          onClick={() => navigate('/admin/boat-monitoring')}
        />

        <StatCard
          title={t('admin.statFishermen')}
          value="1,420"
          unit={language === 'ta' ? 'பயனர்கள்' : 'Users'}
          subtitle={t('admin.statFishermenSub')}
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
                {t('admin.conditionsOverview')}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                {language === 'ta'
                  ? 'முதன்மை மீன்பிடி மண்டலங்களின் கடல்சார் அளவீடுகள்'
                  : 'Sample oceanographic readings across primary fishing zones'}
              </p>
            </div>
            <Link to="/admin/marine-monitoring" className="btn btn-outline btn-sm">
              <span>{t('admin.viewFullModule')}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>{t('admin.sector')}</th>
                  <th>{t('admin.wave')}</th>
                  <th>{t('admin.wind')}</th>
                  <th>{t('admin.risk')}</th>
                  <th>{t('admin.actions')}</th>
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
                        ({region.swellPeriodSeconds}s {t('admin.swellPeriod')})
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
                        <span>{language === 'ta' ? 'ஆய்வு' : 'Inspect'}</span>
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
                {t('admin.systemActivity')}
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              {language === 'ta'
                ? 'ஒருங்கிணைந்த செயற்கைக்கோள் & ரேடார் இடைமுக நிலை'
                : 'Integrated satellite and shore radar interface status'}
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
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {language === 'ta' ? 'கடலோர ரேடார் இணைப்பு' : 'Coastal Radar Link'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Chennai & Karaikal Doppler
                  </div>
                </div>
                <span className="badge-prototype" style={{ backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}>
                  <CheckCircle2 size={12} /> {t('common.demoBadge')}
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
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {language === 'ta' ? 'VHF அவசர அலைவரிசை 16' : 'VHF Emergency Channel 16'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {language === 'ta' ? 'தொடர் கண்காணிப்பு' : 'Continuous Watch Stand'}
                  </div>
                </div>
                <span className="badge-prototype" style={{ backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}>
                  <CheckCircle2 size={12} /> {t('admin.active')}
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
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {language === 'ta' ? 'INCOIS அலை மாதிரி ஒத்திசைவு' : 'INCOIS Swell Model Sync'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {language === 'ta' ? '8 நிமிடங்களுக்கு முன் புதுப்பிக்கப்பட்டது' : 'Updated 8 mins ago'}
                  </div>
                </div>
                <span className="badge-prototype">
                  <Clock size={12} /> {t('common.demoBadge')}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-light)' }}>
            <Link to="/admin/boat-monitoring" className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>{t('admin.boatPresence')}</span>
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
              {t('admin.activeWarnings')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {language === 'ta'
                ? 'மீனவர் போர்ட்டல்களில் தற்போது செயலில் உள்ள அதிகாரப்பூர்வ எச்சரிக்கைகள்'
                : 'Official warnings currently active on fisherman safety portals'}
            </p>
          </div>
          <Link to="/admin/risk-alerts" className="btn btn-outline btn-sm">
            <span>{t('admin.viewFullModule')}</span>
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
                <span>{t('admin.sector')}: {alert.coastalRegion}</span>
                <span>Ref: {alert.bulletinId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminDashboard;
