import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudSun,
  Compass,
  AlertTriangle,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t, language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      title: t('nav.dashboard'),
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: t('nav.marineMonitoring'),
      path: '/admin/marine-monitoring',
      icon: <CloudSun size={20} />,
    },
    {
      title: t('nav.boatMonitoring'),
      path: '/admin/boat-monitoring',
      icon: <Compass size={20} />,
    },
    {
      title: t('nav.riskAlerts'),
      path: '/admin/risk-alerts',
      icon: <AlertTriangle size={20} />,
    },
    {
      title: t('nav.userManagement'),
      path: '/admin/users',
      icon: <Users size={20} />,
    },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  const getPageTitle = () => {
    const current = navItems.find((item) => item.path === location.pathname);
    return current ? current.title : (language === 'ta' ? 'நிர்வாக கட்டுப்பாட்டு மையம்' : 'Admin Command Console');
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
          backgroundColor: 'var(--color-navy-dark)',
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
          borderRight: '1px solid var(--color-navy-border)',
        }}
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: 'var(--space-5)',
            borderBottom: '1px solid var(--color-navy-border)',
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
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            borderBottom: '1px solid rgba(2, 132, 199, 0.2)',
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
              backgroundColor: 'var(--color-ocean-blue)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
              {t('auth.adminTitle')}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
              {language === 'ta' ? 'அதிகாரப்பூர்வ கட்டளை மையம்' : 'Official Command Portal'}
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
              color: 'var(--color-text-inverse-muted)',
              letterSpacing: '0.05em',
            }}
          >
            {t('nav.commandModules')}
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#ffffff' : 'var(--color-text-inverse-muted)',
                backgroundColor: isActive ? 'var(--color-ocean-blue)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {item.icon}
                <span>{item.title}</span>
              </div>
              <ChevronRight size={14} opacity={0.6} />
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer with Logout */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            borderTop: '1px solid var(--color-navy-border)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-teal)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                ADM
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                  Commander V. Nair
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {language === 'ta' ? 'கடலோர காவல்படை கண்காணிப்பு' : 'Coast Guard Maritime Ops'}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            <LogOut size={16} />
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
        className="admin-main-wrapper"
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
              className="admin-menu-toggle"
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

            {/* Notification bell */}
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
                    backgroundColor: 'var(--color-danger)',
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
                      {t('nav.activeAlerts')} (3)
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                    >
                      {t('nav.close')}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.8rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #ef4444' }}>
                      <div style={{ fontWeight: 600, color: '#991b1b' }}>
                        {language === 'ta' ? 'அதி தீவிர புயல் எச்சரிக்கை - கன்னியாகுமரி' : 'Extreme Cyclone Alert - Kanyakumari'}
                      </div>
                      <div style={{ color: '#b91c1c', fontSize: '0.75rem' }}>4.5m swell surge</div>
                    </div>
                    <div style={{ padding: '0.5rem', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #f59e0b' }}>
                      <div style={{ fontWeight: 600, color: '#92400e' }}>
                        {language === 'ta' ? 'அதிவேக காற்று எச்சரிக்கை - மன்னார் வளைகுடா' : 'High Wind Advisory - Gulf of Mannar'}
                      </div>
                      <div style={{ color: '#b45309', fontSize: '0.75rem' }}>28 knot wind gusts</div>
                    </div>
                    <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #3b82f6' }}>
                      <div style={{ fontWeight: 600, color: '#1e40af' }}>
                        {language === 'ta' ? 'துறைமுக தகவல் - காசிமேடு' : 'Harbour Notice - Kasimedu'}
                      </div>
                      <div style={{ color: '#1d4ed8', fontSize: '0.75rem' }}>Normal entry open</div>
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

      {/* Responsive layout styles */}
      <style>{`
        .admin-main-wrapper {
          margin-left: 280px;
        }
        .admin-menu-toggle {
          display: none !important;
        }
        .sidebar-close-btn {
          display: none !important;
        }
        @media (min-width: 900px) {
          .prototype-chip {
            display: inline-block !important;
          }
        }
        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-main-wrapper {
            margin-left: 0;
          }
          .admin-menu-toggle {
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
