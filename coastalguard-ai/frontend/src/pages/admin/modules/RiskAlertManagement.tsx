import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  PlusCircle,
  ShieldAlert,
  CheckCircle,
  X,
  BellRing,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { alertService } from '../../../services/alertService';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import type { SafetyAlert, SeverityLevel } from '../../../types';

export const RiskAlertManagement: React.FC = () => {
  const { t, language } = useAdminLanguage();
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [titleTamil, setTitleTamil] = useState('');
  const [message, setMessage] = useState('');
  const [messageTamil, setMessageTamil] = useState('');
  const [coastalRegion, setCoastalRegion] = useState('Gulf of Mannar');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [recommendedAction, setRecommendedAction] = useState('Return to nearest designated harbour immediately.');
  const [recommendedActionTamil] = useState('அருகிலுள்ள துறைமுகத்திற்கு உடனடியாக திரும்பவும்.');

  const fetchAlerts = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const result = await alertService.getAlerts();
      setAlerts(result.alerts);
    } catch {
      // Ignore errors silently
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      return;
    }

    const alertPayload: Partial<SafetyAlert> = {
      title,
      titleTamil: titleTamil || title,
      message,
      messageTamil: messageTamil || message,
      coastalRegion,
      severity,
      recommendedAction,
      recommendedActionTamil: recommendedActionTamil || recommendedAction,
    };

    const res = await alertService.createAlert(alertPayload);
    setAlerts([res.alert, ...alerts]);
    setIsModalOpen(false);

    // Reset Form
    setTitle('');
    setTitleTamil('');
    setMessage('');
    setMessageTamil('');

    const toastMsg = `Announcement "${res.alert.title}" published successfully.`;

    setSuccessToast(toastMsg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  const countBySeverity = {
    extreme: alerts.filter((a) => a.severity === 'extreme').length,
    high: alerts.filter((a) => a.severity === 'high').length,
    moderate: alerts.filter((a) => a.severity === 'moderate').length,
    low: alerts.filter((a) => a.severity === 'low').length,
  };

  return (
    <AdminLayout>
      <PageHeader
        title={t('alert.title', 'Risk & Alert Management')}
        subtitle={t('alert.subtitle', 'Manage marine weather bulletins, declare coastal danger levels, and simulate emergency broadcasts.')}
        badge="Maritime Console"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <button
              onClick={() => fetchAlerts(false)}
              disabled={isRefreshing}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{t('status.refresh_now', 'Refresh Now')}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <PlusCircle size={18} />
              <span>{t('alert.create_btn', 'Create Announcement')}</span>
            </button>
          </div>
        }
      />

      {/* Success Feedback Toast */}
      {successToast && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-6)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <CheckCircle size={18} />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} style={{ color: '#065f46', border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* 4 Severity Badges & Summary Counts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderLeft: '4px solid var(--color-danger)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-extreme-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-extreme-text)' }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('alert.extreme', 'Extreme Risk')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-extreme-text)' }}>
              {countBySeverity.extreme} {language === 'ta' ? 'செயலில்' : 'Active'}
            </div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderLeft: '4px solid #ef4444' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger-text)' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('alert.high', 'High Danger')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-danger-text)' }}>
              {countBySeverity.high} {language === 'ta' ? 'செயலில்' : 'Active'}
            </div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning-text)' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('alert.moderate', 'Moderate Caution')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-warning-text)' }}>
              {countBySeverity.moderate} {language === 'ta' ? 'செயலில்' : 'Active'}
            </div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-text)' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('alert.low', 'Low / Normal')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success-text)' }}>
              {countBySeverity.low} {language === 'ta' ? 'பதிவானவை' : 'Logged'}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="card-base" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
              {t('alert.bulletins_title', 'Maritime Bulletins & Danger Broadcasts')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {t('alert.bulletins_sub', 'Registry of all active and scheduled coastal safety announcements')}
            </p>
          </div>
          <span className="badge-prototype">
            <Sparkles size={11} /> Maritime Bulletins
          </span>
        </div>

        {isLoading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto var(--space-2)' }} />
            <div>{t('status.loading', 'Loading bulletins...')}</div>
          </div>
        ) : alerts.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle size={32} color="#16a34a" style={{ margin: '0 auto var(--space-2)' }} />
            <div style={{ fontWeight: 700 }}>{t('status.no_records', 'No active alerts')}</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border-light)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>{t('alert.th_id', 'Bulletin ID')}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{t('alert.th_content', 'Title & Description')}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{t('alert.th_sector', 'Coastal Sector')}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{t('alert.th_severity', 'Severity Level')}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{t('alert.th_timeline', 'Issued Timeline')}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{t('alert.th_directive', 'Recommended Directive')}</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => {
                  const displayTitle = language === 'ta' && alert.titleTamil ? alert.titleTamil : alert.title;
                  const displayMessage = language === 'ta' && alert.messageTamil ? alert.messageTamil : alert.message;
                  const displayAction = language === 'ta' && alert.recommendedActionTamil ? alert.recommendedActionTamil : alert.recommendedAction;

                  return (
                    <tr key={alert.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                        {alert.bulletinId}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '340px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: '0.2rem' }}>
                          {displayTitle}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                          {displayMessage}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                        {alert.coastalRegion}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <StatusBadge status={alert.severity} size="sm" />
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        <div>Issued: {alert.issuedAt}</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Valid: {alert.validUntil}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {displayAction}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Announcement Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(7, 19, 34, 0.7)',
            backdropFilter: 'blur(4px)',
            padding: 'var(--space-4)',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="card-base"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: 'var(--space-6)',
              backgroundColor: 'var(--color-surface-white)',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BellRing size={20} color="var(--color-ocean-blue)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                  {t('alert.modal_title', 'Create Safety Announcement')}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--color-text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  {t('alert.modal_bulletin_title', 'Bulletin Title')} (English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Squall Warning & Returning Advisory"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    fontSize: '0.9rem',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  {t('alert.modal_bulletin_title', 'Bulletin Title')} (தமிழ் - Tamil optional)
                </label>
                <input
                  type="text"
                  placeholder="உதா: பலத்த காற்று மற்றும் கரை திரும்பும் எச்சரிக்கை"
                  value={titleTamil}
                  onChange={(e) => setTitleTamil(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    {t('alert.modal_region', 'Coastal Region')}
                  </label>
                  <select
                    value={coastalRegion}
                    onChange={(e) => setCoastalRegion(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border-light)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <option value="Gulf of Mannar">Gulf of Mannar</option>
                    <option value="Palk Strait / Rameswaram">Palk Strait / Rameswaram</option>
                    <option value="Chennai & Coromandel Coast">Chennai & Coromandel Coast</option>
                    <option value="Kanyakumari & Cape Sea">Kanyakumari & Cape Sea</option>
                    <option value="Nagapattinam & Cauvery Delta">Nagapattinam & Cauvery Delta</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    {t('alert.modal_severity', 'Severity Level')}
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border-light)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <option value="low">{t('alert.low', 'Low Risk')}</option>
                    <option value="moderate">{t('alert.moderate', 'Moderate Caution')}</option>
                    <option value="high">{t('alert.high', 'High Danger')}</option>
                    <option value="extreme">{t('alert.extreme', 'Extreme Danger')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  {t('alert.modal_message', 'Safety Message / Advisory Description')}
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the atmospheric trigger, expected swell height, and instructions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  {t('alert.modal_action', 'Recommended Action')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anchor in safe creek or return to harbour"
                  value={recommendedAction}
                  onChange={(e) => setRecommendedAction(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  {t('alert.modal_cancel', 'Cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>{t('alert.modal_submit', 'Publish Announcement')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
