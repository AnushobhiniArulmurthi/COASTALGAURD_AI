import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// Pages
import { HomePage } from '../../pages/home/HomePage';
import { AdminLogin } from '../../pages/auth/AdminLogin';
import { FishermanLogin } from '../../pages/auth/FishermanLogin';

// Admin Pages & Modules
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { MarineMonitoring } from '../../pages/admin/modules/MarineMonitoring';
import { BoatRegionalMonitoring } from '../../pages/admin/modules/BoatRegionalMonitoring';
import { RiskAlertManagement } from '../../pages/admin/modules/RiskAlertManagement';
import { UserManagement } from '../../pages/admin/modules/UserManagement';

// Fisherman Pages & Modules
import { FishermanDashboard } from '../../pages/fisherman/FishermanDashboard';
import { MarineConditionsMap } from '../../pages/fisherman/modules/MarineConditionsMap';
import { SafetyAlertsAssistant } from '../../pages/fisherman/modules/SafetyAlertsAssistant';
import { MyProfile } from '../../pages/fisherman/modules/MyProfile';

// 404 Not Found Fallback Component
const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
        backgroundColor: 'var(--color-bg-main)',
        textAlign: 'center',
      }}
    >
      <div
        className="card-base"
        style={{
          maxWidth: '520px',
          padding: 'var(--space-8)',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4)',
          }}
        >
          <ShieldAlert size={32} />
        </div>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--color-navy-primary)',
            marginBottom: '0.5rem',
          }}
        >
          {t('common.notFoundTitle')}
        </h1>

        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-6)',
            lineHeight: 1.6,
          }}
        >
          {t('common.notFoundDesc')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Link to="/" className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <ArrowLeft size={16} />
            <span>{t('common.returnHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Landing Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/fisherman/login" element={<FishermanLogin />} />

      {/* Admin Portal & Modules */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/marine-monitoring" element={<MarineMonitoring />} />
      <Route path="/admin/boat-monitoring" element={<BoatRegionalMonitoring />} />
      <Route path="/admin/risk-alerts" element={<RiskAlertManagement />} />
      <Route path="/admin/users" element={<UserManagement />} />

      {/* Fisherman Portal & Modules */}
      <Route path="/fisherman/dashboard" element={<FishermanDashboard />} />
      <Route path="/fisherman/marine-map" element={<MarineConditionsMap />} />
      <Route path="/fisherman/safety-assistant" element={<SafetyAlertsAssistant />} />
      <Route path="/fisherman/profile" element={<MyProfile />} />

      {/* Fallback 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
