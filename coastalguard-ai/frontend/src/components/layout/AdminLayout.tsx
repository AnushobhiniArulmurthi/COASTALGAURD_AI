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

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: 'Marine Monitoring',
      path: '/admin/marine-monitoring',
      icon: <CloudSun size={20} />,
    },
    {
      title: 'Boat & Regional Monitoring',
      path: '/admin/boat-monitoring',
      icon: <Compass size={20} />,
    },
    {
      title: 'Risk & Alert Management',
      path: '/admin/risk-alerts',
      icon: <AlertTriangle size={20} />,
    },
    {
      title: 'User Management',
      path: '/admin/users',
      icon: <Users size={20} />,
    },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  const getPageTitle = () => {
    const current = navItems.find((item) => item.path === location.pathname);
    return current ? current.title : 'Admin Command Console';
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
              Authority Operations
            </div>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
              Coastal Command Console
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
              color: 'var(--color-text-inverse-muted)',
            }}
          >
            Command Modules
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
                color: isActive ? '#ffffff' : 'var(--color-text-inverse-muted)',
                backgroundColor: isActive ? 'var(--color-ocean-blue)' : 'transparent',
                transition: 'all var(--transition-fast)',
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
                  Coast Guard Maritime Ops
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

          {/* Right Header Badges & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span className="badge-prototype prototype-chip" style={{ display: 'none' }}>
              Demo Console
            </span>

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
                }}
                title="Notifications"
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
                      Active Alerts (3)
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                    >
                      Close
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-extreme-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-extreme-text)' }}>
                      🚨 Red Alert: Cyclonic surge in Kanyakumari sector.
                    </div>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-danger-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger-text)' }}>
                      ⚠️ High Swells: Gale warnings for Gulf of Mannar.
                    </div>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-warning-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-warning-text)' }}>
                      ⚡ Convective storm near Nagapattinam Delta.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Mini Profile */}
            <div
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
                  backgroundColor: 'var(--color-navy-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                VN
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-primary)' }} className="admin-name">
                V. Nair (Admin)
              </span>
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
        @media (min-width: 1024px) {
          .admin-sidebar {
            position: fixed !important;
            transform: translateX(0) !important;
          }
          .admin-main-wrapper {
            margin-left: 280px !important;
          }
          .admin-menu-toggle {
            display: none !important;
          }
          .sidebar-close-btn {
            display: none !important;
          }
          .prototype-chip {
            display: inline-flex !important;
          }
        }
        @media (max-width: 1023px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .admin-main-wrapper {
            margin-left: 0 !important;
          }
          .admin-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
