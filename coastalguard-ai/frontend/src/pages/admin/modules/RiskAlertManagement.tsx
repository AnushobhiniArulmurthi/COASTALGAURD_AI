import React, { useState } from 'react';
import {
  AlertTriangle,
  PlusCircle,
  ShieldAlert,
  CheckCircle,
  X,
  BellRing,
  Info,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { mockAlerts as initialAlerts } from '../../../data/mockData';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { SafetyAlert, SeverityLevel } from '../../../types';

export const RiskAlertManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [alerts, setAlerts] = useState<SafetyAlert[]>(initialAlerts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [coastalRegion, setCoastalRegion] = useState('Gulf of Mannar');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [recommendedAction, setRecommendedAction] = useState('Return to nearest designated harbour immediately.');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      return;
    }

    const newAlert: SafetyAlert = {
      id: `alert-demo-${Date.now()}`,
      title,
      message,
      coastalRegion,
      severity,
      issuedAt: language === 'ta' ? 'இப்போது (மாதிரி)' : 'Just now (Prototype draft)',
      validUntil: language === 'ta' ? 'அடுத்த 24 மணிநேரம்' : 'Next 24 Hours',
      bulletinId: `CG-IN-2026-${Math.floor(100 + Math.random() * 900)}`,
      isActive: true,
      recommendedAction,
    };

    setAlerts([newAlert, ...alerts]);
    setIsModalOpen(false);

    // Reset Form
    setTitle('');
    setMessage('');

    setSuccessToast(
      language === 'ta'
        ? `"${newAlert.title}" அறிவிப்பு மாதிரி நிலையாக வெளியிடப்பட்டது.`
        : `Announcement "${newAlert.title}" published to prototype demo state.`
    );
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
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
        title={t('admin.riskTitle')}
        subtitle={t('admin.riskSubtitle')}
        badge={t('common.prototypeBadge')}
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <PlusCircle size={18} />
            <span>{t('admin.createAnnouncement')}</span>
          </button>
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
          <button onClick={() => setSuccessToast(null)} style={{ color: '#065f46' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Prototype Notice */}
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
          <strong>{language === 'ta' ? 'செயல்முறை மாதிரி அறிவிப்பு:' : 'Simulated Broadcast Notice:'}</strong>{' '}
          {language === 'ta'
            ? 'இந்த போர்ட்டலில் ஒரு புதிய எச்சரிக்கையை உருவாக்குவது மாதிரி நிலையைப் புதுப்பிக்கிறது. உண்மையான மீனவர்களுக்கு எந்தவொரு வெளிப்புற எஸ்எம்எஸ் அல்லது புஷ் அறிவிப்புகளும் அனுப்பப்படாது.'
            : 'Creating an announcement in this prototype updates local React state for demonstration. No external push notifications or SMS dispatches are delivered to real fishermen.'}
        </div>
      </div>

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
              {t('common.extreme')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-extreme-text)' }}>
              {countBySeverity.extreme} {t('admin.active')}
            </div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderLeft: '4px solid #ef4444' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger-text)' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('common.high')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-danger-text)' }}>
              {countBySeverity.high} {t('admin.active')}
            </div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning-text)' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('common.moderate')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-warning-text)' }}>
              {countBySeverity.moderate} {t('admin.active')}
            </div>
          </div>
        </div>

        <div className="card-base" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-text)' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('common.low')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success-text)' }}>
              {countBySeverity.low} {language === 'ta' ? 'பதிவானது' : 'Logged'}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="card-base" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
              {language === 'ta' ? 'கடல்சார் வானிலை எச்சரிக்கைகள் & அறிவிப்புகள்' : 'Maritime Bulletins & Danger Broadcasts'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {language === 'ta' ? 'செயலில் உள்ள அனைத்து கடலோர பாதுகாப்பு அறிவிப்புகளின் பட்டியல்' : 'Registry of all active and scheduled coastal safety announcements'}
            </p>
          </div>
          <span className="badge-prototype">
            <Sparkles size={11} /> {t('common.demoBadge')}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border-light)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.bulletinId')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.alertTitle')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.coastalZone')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.severity')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.lastUpdated')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.action')}</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
                    {alert.bulletinId}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', maxWidth: '340px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)', marginBottom: '0.2rem' }}>
                      {alert.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      {alert.message}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                    {alert.coastalRegion}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <StatusBadge status={alert.severity} size="sm" />
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    <div>{language === 'ta' ? 'வெளியீடு:' : 'Issued:'} {alert.issuedAt}</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>{language === 'ta' ? 'செல்லுபடியாகும்:' : 'Valid:'} {alert.validUntil}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {alert.recommendedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BellRing size={20} color="var(--color-ocean-blue)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                  {t('admin.modalTitle')}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  {t('admin.fieldTitle')}
                </label>
                <input
                  type="text"
                  placeholder={t('admin.fieldTitlePlaceholder')}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    {t('admin.fieldRegion')}
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
                    {t('admin.fieldSeverity')}
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
                    <option value="low">{t('common.low')}</option>
                    <option value="moderate">{t('common.moderate')}</option>
                    <option value="high">{t('common.high')}</option>
                    <option value="extreme">{t('common.extreme')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  {t('admin.fieldMessage')}
                </label>
                <textarea
                  rows={3}
                  placeholder={t('admin.fieldMessagePlaceholder')}
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
                  {t('admin.fieldAction')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Return to nearest harbour / துறைமுகத்திற்கு திரும்புங்கள்"
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
                  {t('admin.cancelBtn')}
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>{t('admin.publishBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default RiskAlertManagement;
