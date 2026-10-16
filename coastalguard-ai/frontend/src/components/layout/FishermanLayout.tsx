import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
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
  ShieldAlert
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { OneTapSosButton } from '../common/OneTapSosButton';

interface FishermanLayoutProps {
  children: React.ReactNode;
}

export const FishermanLayout: React.FC<FishermanLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      title: 'Dashboard',
      path: '/fisherman/dashboard',
      icon: <Compass size={20} />,
      tamil: 'முகப்பு பலகை',
    },
    {
      title: 'Marine Conditions & Map',
      path: '/fisherman/marine-map',
      icon: <MapPin size={20} />,
      tamil: 'கடல் வரைபடம் & வானிலை',
    },
    {
      title: 'Safety Alerts & AI Assistant',
      path: '/fisherman/safety-assistant',
      icon: <BotMessageSquare size={20} />,
      tamil: 'பாதுகாப்பு எச்சரிக்கை & AI',
    },
    {
      title: 'My Profile',
      path: '/fisherman/profile',
      icon: <User size={20} />,
      tamil: 'எனது சுயவிவரம்',
    },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  const getPageTitle = () => {
    const current = navItems.find((item) => item.path === location.pathname);
    return current ? current.title : 'Fisherman Safety Console';
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
              Fisherman Safety Portal
            </div>
            <div style={{ fontSize: '0.7rem', color: '#2dd4bf' }}>
              மீனவர் பாதுகாப்பு தளம்
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            padding: 'var(--space-4) var(--space-3)',
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div
            style={{
              padding: '0 0.5rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#7ba1c2',
            }}
          >
            Fisherman Modules
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : '#94b5d4',
                backgroundColor: isActive ? 'var(--color-teal)' : 'transparent',
                transition: 'all var(--transition-fast)',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {item.icon}
                <div>
                  <div>{item.title}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{item.tamil}</div>
                </div>
              </div>
              <ChevronRight size={14} opacity={0.6} />
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer with Logout & User Info */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            borderTop: '1px solid #133959',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: 'var(--space-3)',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-ocean-blue)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              MS
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                M. Selvam (செல்வம்)
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94b5d4' }}>
                Boat: Kadalarasan (Rameswaram)
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
              transition: 'background-color var(--transition-fast)',
            }}
          >
            <LogOut size={16} />
            <span>Logout to Home</span>
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

          {/* Right Header Badges & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {/* One-Tap Emergency SOS Trigger */}
            <OneTapSosButton variant="header" userId="usr-101" />

            <span
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'var(--color-warning-bg)',
                color: 'var(--color-warning-text)',
                border: '1px solid var(--color-warning-border)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
              className="sea-status-badge"
            >
              <ShieldAlert size={13} />
              <span>Swell Alert Active</span>
            </span>

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
                }}
                title="Emergency alerts"
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
                      Marine Warnings (மழை எச்சரிக்கை)
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                    >
                      Close
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-danger-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger-text)' }}>
                      ⚠️ <strong>Gulf of Mannar:</strong> Gale winds 35 knots. நாட்டுப்படகுகள் கடலுக்குச் செல்ல வேண்டாம்.
                    </div>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-info-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-info-text)' }}>
                      ℹ️ <strong>Rameswaram Harbour:</strong> Shelter available at Pier 3.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Name */}
            <Link
              to="/fisherman/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-teal)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                MS
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)' }} className="fisherman-name">
                M. Selvam
              </span>
            </Link>
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
        @media (min-width: 1024px) {
          .fisherman-sidebar {
            position: fixed !important;
            transform: translateX(0) !important;
          }
          .fisherman-main-wrapper {
            margin-left: 280px !important;
          }
          .fisherman-menu-toggle {
            display: none !important;
          }
          .sidebar-close-btn {
            display: none !important;
          }
          .sea-status-badge {
            display: inline-flex !important;
          }
        }
        @media (max-width: 1023px) {
          .fisherman-sidebar {
            transform: translateX(-100%);
          }
          .fisherman-sidebar.open {
            transform: translateX(0) !important;
          }
          .fisherman-main-wrapper {
            margin-left: 0 !important;
          }
          .fisherman-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
