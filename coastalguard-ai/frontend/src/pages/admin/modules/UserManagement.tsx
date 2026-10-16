import React, { useState } from 'react';
import {
  Search,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { PageHeader } from '../../../components/common/PageHeader';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { mockUsers as initialUsers } from '../../../data/mockData';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { FishermanUser } from '../../../types';

export const UserManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [users, setUsers] = useState<FishermanUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<FishermanUser | null>(null);

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          const nextStatus = user.accountStatus === 'active' ? 'inactive' : 'active';
          return { ...user, accountStatus: nextStatus };
        }
        return user;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.contact.toLowerCase().includes(search.toLowerCase()) ||
      u.homeHarbour.toLowerCase().includes(search.toLowerCase()) ||
      u.vesselName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || u.accountStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <PageHeader
        title={t('admin.userTitle')}
        subtitle={t('admin.userSubtitle')}
        badge={t('common.prototypeBadge')}
      />

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
        <AlertCircle size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>{language === 'ta' ? 'மாதிரி பயனர் பதிவுகள்:' : 'Privacy & Simulation Note:'}</strong>{' '}
          {language === 'ta'
            ? 'சோதனை நோக்கத்திற்கான மாதிரி பயனர் பதிவுகள். இந்த முன்மாதிரியில் உண்மையான தனிநபர் அடையாளங்கள் அல்லது அரசு எண்கள் சேமிக்கப்படவில்லை.'
            : 'Fictional demonstration user records. No genuine personal identifiables or governmental identity numbers are held in this prototype.'}
        </div>
      </div>

      {/* User Table Card */}
      <div className="card-base" style={{ padding: 'var(--space-6)' }}>
        {/* Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy-primary)' }}>
              {t('admin.directory')} ({users.length})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {language === 'ta'
                ? 'துறைமுகம் அல்லது மீனவர் பெயர் / படகு பதிவெண் மூலம் தேடலாம்'
                : 'Filter by harbour location or search by name / vessel registration'}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder={language === 'ta' ? 'பயனர், மொபைல், துறைமுகம் தேடவும்...' : 'Search user, mobile, harbour...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '0.85rem',
                  minWidth: '240px',
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-navy-primary)',
              }}
            >
              <option value="all">{t('admin.allStatuses')}</option>
              <option value="active">{t('admin.active')}</option>
              <option value="inactive">{t('admin.inactive')}</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border-light)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.name')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.contact')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.homeHarbour')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.vessel')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.preferredLang')}</th>
                <th style={{ padding: '0.75rem 1rem' }}>{t('admin.signalStatus')}</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy-primary)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: {user.id}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-secondary)' }}>
                    {user.contact}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>{user.homeHarbour}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600 }}>{user.vesselName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.registrationNo}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.15rem 0.45rem', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-sm)' }}>
                      {user.preferredLanguage === 'ta' ? 'தமிழ்' : 'English'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <StatusBadge status={user.accountStatus} size="sm" />
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                        title="View Details"
                      >
                        <Eye size={13} />
                        <span>{language === 'ta' ? 'விவரம்' : 'Details'}</span>
                      </button>

                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="btn btn-sm"
                        style={{
                          padding: '0.3rem 0.55rem',
                          fontSize: '0.75rem',
                          backgroundColor: user.accountStatus === 'active' ? '#fee2e2' : '#dcfce7',
                          color: user.accountStatus === 'active' ? '#991b1b' : '#166534',
                        }}
                      >
                        {user.accountStatus === 'active' ? t('admin.toggleActive') : t('admin.toggleInactive')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
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
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="card-base"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: 'var(--space-6)',
              backgroundColor: 'var(--color-surface-white)',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--color-ocean-blue)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                    {selectedUser.name}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Account ID: {selectedUser.id}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{t('admin.contact')}:</span>
                <span style={{ fontWeight: 600 }}>{selectedUser.contact}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{t('admin.homeHarbour')}:</span>
                <span style={{ fontWeight: 600 }}>{selectedUser.homeHarbour}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{t('fisherman.boatNameLabel')}:</span>
                <span style={{ fontWeight: 600, color: 'var(--color-ocean-blue)' }}>{selectedUser.vesselName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{t('fisherman.regNumberLabel')}:</span>
                <span style={{ fontWeight: 600 }}>{selectedUser.registrationNo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{t('fisherman.languagePref')}:</span>
                <span style={{ fontWeight: 600 }}>{selectedUser.preferredLanguage === 'ta' ? 'தமிழ் (Tamil)' : 'English'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{language === 'ta' ? 'சேர்ந்த தேதி:' : 'Joined Date:'}</span>
                <span style={{ fontWeight: 600 }}>{selectedUser.joinedDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{t('admin.signalStatus')}:</span>
                <StatusBadge status={selectedUser.accountStatus} size="sm" />
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <button onClick={() => setSelectedUser(null)} className="btn btn-outline btn-sm">
                {t('nav.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default UserManagement;
