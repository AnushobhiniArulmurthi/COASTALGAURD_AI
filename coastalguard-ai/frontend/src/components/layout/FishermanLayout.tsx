import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  MapPin,
  BotMessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Anchor,
  ChevronRight,
  LifeBuoy
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';
import { SosEmergencyModal } from '../emergency/SosEmergencyModal';

interface FishermanLayoutProps {
  children: React.ReactNode;
}

export const FishermanLayout: React.FC<FishermanLayoutProps> = ({ children }) => {
  const { t, language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      title: t('nav.dashboard'),
      path: '/fisherman/dashboard',
      icon: <Compass size={20} />,
      sub: language === 'ta' ? 'முகப்பு பலகை' : 'Cockpit Overview',
    },
    {
      title: t('nav.marineMap'),
      path: '/fisherman/marine-map',
      icon: <MapPin size={20} />,
      sub: language === 'ta' ? 'கடல் வரைபடம் & வானிலை' : 'Nautical Charts',
    },
    {
      title: t('nav.safetyAssistant'),
      path: '/fisherman/safety-assistant',
      icon: <BotMessageSquare size={20} />,
      sub: language === 'ta' ? 'பாதுகாப்பு & AI வழிகாட்டி' : 'Alerts & AI Guidance',
    },
    {
      title: t('nav.myProfile'),
      path: '/fisherman/profile',
      icon: <User size={20} />,
      sub: language === 'ta' ? 'எனது சுயவிவரம்' : 'Vessel Registration',
    },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  const getPageTitle = () => {
    const current = navItems.find((item) => item.path === location.pathname);
    return current ? current.title : (language === 'ta' ? 'மீனவர் பாதுகாப்பு பலகை' : 'Fisherman Safety Console');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            backgroundColor: 'rgba(7, 19, 34, 0.6)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#092338',
          color: 'var(--color-text-inverse)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
          transition: 'transform var(--transition-smooth)',
          borderRight: '1px solid #133959',
        }}
        className={`fisherman-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: 'var(--space-5)',
            borderBottom: '1px solid #133959',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Logo size="sm" theme="light" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close-btn"
            style={{ color: 'var(--color-text-inverse-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Portal Identifier */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            backgroundColor: 'rgba(13, 148, 136, 0.15)',
            borderBottom: '1px solid rgba(13, 148, 136, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-teal)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Anchor size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
              {t('auth.fishermanTitle')}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#2dd4bf' }}>
              {language === 'ta' ? 'கடல் பாதுகாப்பு சேவைகள்' : 'Sea Safety Services'}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            flex: 1,
            padding: 'var(--space-4) var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              padding: '0 var(--space-3) var(--space-2)',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#64748b',
              letterSpacing: '0.05em',
            }}
          >
            {t('nav.safetyServices')}
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `fisherman-nav-item ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? 'var(--color-teal)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {item.icon}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{item.title}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>{item.sub}</span>
                </div>
              </div>
              <ChevronRight size={14} opacity={0.6} />
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer with SOS, Fisherman Info and Logout */}
        <div
          style={{
            padding: '0.65rem 0.85rem',
            borderTop: '1px solid #133959',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 1. Red SOS — EMERGENCY Button (Above Fisherman Profile) */}
          <button
            id="sidebar-sos-button"
            onClick={() => setSosModalOpen(true)}
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: '1.5px solid #ef4444',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(220, 38, 38, 0.4)',
              transition: 'all var(--transition-fast)',
              margin: '0 0 2px 0', // 2px gap to profile below (fulfills 0-4px spacing)
            }}
            className="sidebar-sos-btn"
            aria-label="SOS Emergency Alert"
          >
            <LifeBuoy size={18} />
            <span>{t('sos.buttonText')}</span>
          </button>

          {/* 2. Fisherman profile details directly below SOS button (2px vertical gap) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '3px 2px',
              margin: '0 0 4px 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-ocean-blue)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}
              >
                MS
              </div>
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  M. Selvam (செல்வம்)
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  Rameswaram • IND-TN-10
                </div>
              </div>
            </div>
          </div>

          {/* 3. Logout to Home button below profile */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            <LogOut size={15} />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
        className="fisherman-main-wrapper"
      >
        {/* Top Header */}
        <header
          style={{
            height: '70px',
            backgroundColor: 'var(--color-surface-white)',
            borderBottom: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--space-6)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="fisherman-menu-toggle"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
                color: 'var(--color-navy-primary)',
              }}
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy-primary)' }}>
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* Right Header: Language Selector + Notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <LanguageSelector />

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: 'relative',
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-bg-alt)',
                  color: 'var(--color-navy-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title={t('nav.activeAlerts')}
              >
                <Bell size={18} />
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-warning)',
                  }}
                />
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div
                  className="card-base"
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '320px',
                    backgroundColor: 'var(--color-surface-white)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: 'var(--space-4)',
                    zIndex: 60,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-navy-primary)' }}>
                      {t('nav.activeAlerts')} (2)
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                    >
                      {t('nav.close')}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.8rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #f59e0b' }}>
                      <div style={{ fontWeight: 600, color: '#92400e' }}>
                        {language === 'ta' ? 'அதிவேக காற்று: மன்னார் வளைகுடா' : 'High Swell: Gulf of Mannar'}
                      </div>
                      <div style={{ color: '#b45309', fontSize: '0.75rem' }}>
                        {language === 'ta' ? '3.2 மீ அலைகள், காற்றின் வேகம் 28 நாட்ஸ்' : '3.2m swells, wind gusting 28 knots'}
                      </div>
                    </div>
                    <div style={{ padding: '0.5rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #10b981' }}>
                      <div style={{ fontWeight: 600, color: '#166534' }}>
                        {language === 'ta' ? 'பாதுகாப்பு மையம்: இராமேஸ்வரம்' : 'Safe Haven: Rameswaram Port'}
                      </div>
                      <div style={{ color: '#15803d', fontSize: '0.75rem' }}>
                        {language === 'ta' ? 'அனைத்து படகுகளுக்கும் திறக்கப்பட்டுள்ளது (VHF 16)' : 'Open for anchorage (VHF 16)'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main
          style={{
            flex: 1,
            padding: 'var(--space-6)',
            maxWidth: '1600px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          {children}
        </main>
      </div>

      {/* Full-Screen Emergency SOS Confirmation & 5-Second Countdown Overlay */}
      <SosEmergencyModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />

      {/* Responsive layout styles */}
      <style>{`
        .fisherman-main-wrapper {
          margin-left: 280px;
        }
        .fisherman-menu-toggle {
          display: none !important;
        }
        .sidebar-close-btn {
          display: none !important;
        }
        @media (min-width: 900px) {
          .sea-status-badge {
            display: inline-flex !important;
          }
        }
        @media (max-width: 1024px) {
          .fisherman-sidebar {
            transform: translateX(-100%);
          }
          .fisherman-sidebar.open {
            transform: translateX(0);
          }
          .fisherman-main-wrapper {
            margin-left: 0;
          }
          .fisherman-menu-toggle {
            display: flex !important;
          }
          .sidebar-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
