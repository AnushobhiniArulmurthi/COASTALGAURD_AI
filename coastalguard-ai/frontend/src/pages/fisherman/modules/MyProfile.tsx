import React, { useState } from 'react';
import {
  Anchor,
  MapPin,
  CheckCircle,
  Save,
  Edit2,
  X,
  ShieldCheck,
  Info
} from 'lucide-react';
import { FishermanLayout } from '../../../components/layout/FishermanLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useLanguage } from '../../../i18n/LanguageContext';
import { authService } from '../../../services/authService';

export const MyProfile: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const currentUser = authService.getCurrentUser();

  // Profile Form State initialized from active session
  const [name, setName] = useState(currentUser?.fullName || 'M. Selvam (செல்வம்)');
  const [contact, setContact] = useState(currentUser?.mobileNumber || '+91 98401 23456');
  const [email, setEmail] = useState(currentUser?.email || 'selvam.fisher@demo-mail.com');
  const [homeHarbour, setHomeHarbour] = useState(currentUser?.homeHarbour || 'Rameswaram Fishing Harbour');
  const [vesselName, setVesselName] = useState(currentUser?.vesselName || 'Kadalarasan (கடலரசன்)');
  const [registrationNo, setRegistrationNo] = useState(currentUser?.registrationNo || 'IND-TN-10-MM-4021');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveToast(true);

    try {
      const updated = {
        ...currentUser,
        fullName: name,
        mobileNumber: contact,
        email,
        homeHarbour,
        vesselName,
        registrationNo,
      };
      localStorage.setItem('cg_fisherman_user', JSON.stringify(updated));
    } catch {
      // LocalStorage error
    }

    setTimeout(() => {
      setSaveToast(false);
    }, 3500);
  };

  return (
    <FishermanLayout>
      <PageHeader
        title={t('fisherman.profileTitle')}
        subtitle={t('fisherman.profileSubtitle')}
        badge={t('common.demoBadge')}
        action={
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Edit2 size={16} />
              <span>{t('fisherman.editBtn')}</span>
            </button>
          ) : null
        }
      />

      {/* Success Notification */}
      {saveToast && (
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
            <span>{t('fisherman.savedToast')}</span>
          </div>
          <button onClick={() => setSaveToast(false)} style={{ color: '#065f46' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Prototype Disclaimer */}
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
          <strong>{language === 'ta' ? 'உள்ளூர் மாதிரி பயன்முறை:' : 'Local Prototype Mode:'}</strong>{' '}
          {language === 'ta'
            ? 'மாற்றங்கள் மாதிரி நினைவகத்தில் சேமிக்கப்படுகின்றன. வெளிப்புற தரவுத்தளம் இணைக்கப்படவில்லை.'
            : 'Changes are saved to component state for demonstration during reviews. No backend database or Supabase credentials are connected.'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {/* Profile Identity Card */}
        <div className="card-base" style={{ padding: 'var(--space-6)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-teal)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 800,
                margin: '0 auto var(--space-4)',
                boxShadow: '0 8px 16px rgba(13, 148, 136, 0.25)',
                border: '4px solid #ffffff',
              }}
            >
              MS
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy-primary)', marginBottom: '0.25rem' }}>
              {name}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              {language === 'ta' ? 'நாட்டுப்படகு மாலுமி' : 'Artisanal Trawler Skipper'}
            </p>

            <StatusBadge status="active" />
          </div>

          <div style={{ width: '100%', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-light)', textAlign: 'left', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
              <Anchor size={16} color="var(--color-teal)" />
              <span>{t('fisherman.boatNameLabel')}: <strong>{vesselName}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
              <ShieldCheck size={16} color="var(--color-teal)" />
              <span>{t('fisherman.regNumberLabel')}: <strong>{registrationNo}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
              <MapPin size={16} color="var(--color-teal)" />
              <span>{t('fisherman.homeHarbourLabel')}: <strong>{homeHarbour}</strong></span>
            </div>
          </div>
        </div>

        {/* Profile Information / Edit Form */}
        <div className="card-base" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
              {isEditing ? t('fisherman.editBtn') : t('fisherman.personalInfo')}
            </h3>
            {isEditing && (
              <span className="badge-prototype">
                {language === 'ta' ? 'திருத்தம் இயக்கப்பட்டது' : 'Editing Enabled'}
              </span>
            )}
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)', marginBottom: '0.35rem' }}>
                  {t('fisherman.fullName')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    backgroundColor: isEditing ? '#ffffff' : 'var(--color-bg-alt)',
                    fontSize: '0.9rem',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)', marginBottom: '0.35rem' }}>
                  {t('fisherman.contactNumber')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    backgroundColor: isEditing ? '#ffffff' : 'var(--color-bg-alt)',
                    fontSize: '0.9rem',
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)', marginBottom: '0.35rem' }}>
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    backgroundColor: isEditing ? '#ffffff' : 'var(--color-bg-alt)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)', marginBottom: '0.35rem' }}>
                  {t('fisherman.languagePref')}
                </label>
                <select
                  disabled={!isEditing}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'ta' | 'en')}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    backgroundColor: isEditing ? '#ffffff' : 'var(--color-bg-alt)',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)', marginBottom: '0.35rem' }}>
                  {t('fisherman.homeHarbourLabel')}
                </label>
                <select
                  disabled={!isEditing}
                  value={homeHarbour}
                  onChange={(e) => setHomeHarbour(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    backgroundColor: isEditing ? '#ffffff' : 'var(--color-bg-alt)',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value="Rameswaram Fishing Harbour">Rameswaram Fishing Harbour</option>
                  <option value="Kasimedu (Chennai) Fishing Harbour">Kasimedu (Chennai) Fishing Harbour</option>
                  <option value="Tuticorin South Port">Tuticorin South Port</option>
                  <option value="Chinnamuttam Fishing Harbour">Chinnamuttam (Kanyakumari)</option>
                  <option value="Nagapattinam All-Weather Harbour">Nagapattinam All-Weather Harbour</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)', marginBottom: '0.35rem' }}>
                  {t('fisherman.boatNameLabel')}
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    backgroundColor: isEditing ? '#ffffff' : 'var(--color-bg-alt)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)', marginBottom: '0.35rem' }}>
                {t('fisherman.regNumberLabel')}
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border-light)',
                  backgroundColor: isEditing ? '#ffffff' : 'var(--color-bg-alt)',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {isEditing && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline"
                >
                  {t('fisherman.cancel')}
                </button>
                <button type="submit" className="btn btn-accent">
                  <Save size={16} />
                  <span>{t('fisherman.saveBtn')}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </FishermanLayout>
  );
};
export default MyProfile;
