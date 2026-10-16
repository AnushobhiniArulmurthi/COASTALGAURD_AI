import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleGetStarted = () => {
    scrollToSection('choose-portal');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: isScrolled ? 'rgba(7, 19, 34, 0.96)' : 'rgba(7, 19, 34, 0.98)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
        boxShadow: isScrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)' : 'none',
        transition: 'all var(--transition-normal)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Logo size="md" theme="light" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 'var(--space-8)',
          }}
          className="desktop-nav"
        >
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            style={{
              fontWeight: 600,
              color: location.pathname === '/' ? '#38bdf8' : '#e2e8f0',
              fontSize: '0.95rem',
              transition: 'color var(--transition-fast)',
              textDecoration: 'none',
            }}
          >
            Home
          </Link>
          <button
            onClick={() => scrollToSection('features')}
            style={{
              background: 'none',
              border: 'none',
              fontWeight: 600,
              color: '#cbd5e1',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('about')}
            style={{
              background: 'none',
              border: 'none',
              fontWeight: 600,
              color: '#cbd5e1',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            About Us
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            style={{
              background: 'none',
              border: 'none',
              fontWeight: 600,
              color: '#cbd5e1',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Contact
          </button>
        </nav>

        {/* Desktop "Get Started" Call To Action */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
          className="desktop-actions"
        >
          <button
            onClick={handleGetStarted}
            className="btn btn-ocean"
            style={{
              padding: '0.6rem 1.35rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
            }}
          >
            <span>Get Started</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 42,
            height: 42,
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: '#ffffff',
            cursor: 'pointer',
          }}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          style={{
            backgroundColor: '#071322',
            borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
            padding: 'var(--space-5) var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <Link
            to="/"
            onClick={() => {
              setIsOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              padding: 'var(--space-2) 0',
              fontWeight: 600,
              color: '#38bdf8',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              textDecoration: 'none',
            }}
          >
            Home
          </Link>
          <button
            onClick={() => scrollToSection('features')}
            style={{
              padding: 'var(--space-2) 0',
              textAlign: 'left',
              fontWeight: 600,
              color: '#cbd5e1',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
            }}
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('about')}
            style={{
              padding: 'var(--space-2) 0',
              textAlign: 'left',
              fontWeight: 600,
              color: '#cbd5e1',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
            }}
          >
            About Us
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            style={{
              padding: 'var(--space-2) 0',
              textAlign: 'left',
              fontWeight: 600,
              color: '#cbd5e1',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
            }}
          >
            Contact
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              handleGetStarted();
            }}
            className="btn btn-ocean"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: 'var(--space-2)',
            }}
          >
            <span>Get Started</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
