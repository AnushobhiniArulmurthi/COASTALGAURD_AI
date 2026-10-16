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

export const MyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Profile Form State
  const [name, setName] = useState('M. Selvam (செல்வம்)');
  const [contact, setContact] = useState('+91 98401 23456');
  const [email, setEmail] = useState('selvam.fisher@demo-mail.com');
  const [homeHarbour, setHomeHarbour] = useState('Rameswaram Fishing Harbour');
  const [preferredLanguage, setPreferredLanguage] = useState<'ta' | 'en'>('ta');
  const [vesselName, setVesselName] = useState('Kadalarasan (கடலரசன்)');
  const [registrationNo, setRegistrationNo] = useState('IND-TN-10-MM-4021');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveToast(true);

    setTimeout(() => {
      setSaveToast(false);
    }, 3500);
  };

  return (
    <FishermanLayout>
      <PageHeader
        title="My Profile & Vessel Credentials"
        subtitle="Manage your fisherman registration details, primary harbor allocation, and vessel emergency transponder info."
        badge="Demonstration Profile"
        action={
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
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
            <span>Profile details updated successfully in local prototype memory!</span>
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
          <strong>Local Prototype Mode:</strong> Changes are saved to component state for demonstration during reviews. No backend database or Supabase credentials are connected.
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
              Artisanal Trawler Skipper
            </p>

            <StatusBadge status="active" />
          </div>

          <div style={{ width: '100%', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-light)', textAlign: 'left', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
              <Anchor size={16} color="var(--color-teal)" />
              <span>Registered Vessel: <strong>{vesselName}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
              <ShieldCheck size={16} color="var(--color-teal)" />
              <span>Gov Reg: <strong>{registrationNo}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
              <MapPin size={16} color="var(--color-teal)" />
              <span>Base Port: <strong>{homeHarbour}</strong></span>
            </div>
          </div>
        </div>

        {/* Profile Information / Edit Form */}
        <div className="card-base" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
              {isEditing ? 'Edit Profile Details' : 'Account & Vessel Information'}
            </h3>
            {isEditing && (
              <span className="badge-prototype">
                Editing Enabled
              </span>
            )}
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)', marginBottom: '0.35rem' }}>
                  Full Name
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
                  Contact Mobile Number
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
                  Registered Email Address
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
                  Preferred Language
                </label>
                <select
                  disabled={!isEditing}
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as 'ta' | 'en')}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border-light)',
                    backgroundColor: isEditing ? '#ffffff' : 'var(--color-bg-alt)',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)', marginBottom: '0.35rem' }}>
                  Home Fishing Harbour
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
                  Vessel Name
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
                Craft Registration Number
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
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent">
                  <Save size={16} />
                  <span>Save Profile (Local UI)</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </FishermanLayout>
  );
};
