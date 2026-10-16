import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, LifeBuoy, Heart, Mail, Phone, Radio, MapPin } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#071322',
        color: '#f8fafc',
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-8)',
        borderTop: '1px solid rgba(56, 189, 248, 0.15)',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-10)',
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <Logo size="md" theme="light" />
            </div>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.9rem',
                lineHeight: 1.65,
                marginBottom: 'var(--space-4)',
              }}
            >
              CoastalGuard AI is a dedicated marine safety assistance platform engineered to bring coastal weather intelligence, risk awareness, and safety communication together for fishing communities and maritime authorities.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              <LifeBuoy size={14} />
              <span>Safer Seas • Smarter Decisions</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: 'var(--space-4)',
                letterSpacing: '0.02em',
              }}
            >
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0, margin: 0 }}>
              <li>
                <Link
                  to="/"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  style={{ color: '#cbd5e1', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('features')}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Features & Capabilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contact')}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Contact & Assistance
                </button>
              </li>
            </ul>
          </div>

          {/* Authorized Access */}
          <div>
            <h4
              style={{
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: 'var(--space-4)',
                letterSpacing: '0.02em',
              }}
            >
              Platform Access
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
              Independent entry points for registered personnel:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link
                to="/fisherman/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#38bdf8',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <span>→ Fisherman Portal Login</span>
              </Link>
              <Link
                to="/admin/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#2dd4bf',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <span>→ Admin Portal Login</span>
              </Link>
            </div>
          </div>

          {/* Emergency & Coastal Assistance */}
          <div>
            <h4
              style={{
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: 'var(--space-4)',
                letterSpacing: '0.02em',
              }}
            >
              Emergency & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Radio size={16} color="#38bdf8" />
                <span>VHF Distress: Channel 16 (156.8 MHz)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#2dd4bf" />
                <span>Coast Guard Helpline: 1554 (Toll-Free)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#38bdf8" />
                <span>contact@coastalguard.gov.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#2dd4bf" />
                <span>Coromandel & Gulf of Mannar Maritime Command</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 'var(--space-6)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} CoastalGuard AI. Built for Coastal Fishing Safety & Maritime Operations.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Shield size={14} color="#38bdf8" /> Prototype Edition
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Made with <Heart size={14} color="#ef4444" /> for fishermen
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
