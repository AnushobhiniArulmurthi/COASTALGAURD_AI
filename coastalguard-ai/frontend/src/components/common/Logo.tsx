import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Waves } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  asLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  theme = 'dark',
  asLink = true,
}) => {
  const iconSizes = {
    sm: 20,
    md: 26,
    lg: 34,
  };

  const textSizes = {
    sm: '1rem',
    md: '1.25rem',
    lg: '1.65rem',
  };

  const isLight = theme === 'light';

  const content = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size === 'sm' ? 34 : size === 'md' ? 42 : 52,
          height: size === 'sm' ? 34 : size === 'md' ? 42 : 52,
          borderRadius: '10px',
          background: isLight
            ? 'rgba(255, 255, 255, 0.15)'
            : 'linear-gradient(135deg, #0b192c 0%, #0284c7 100%)',
          border: isLight
            ? '1px solid rgba(255, 255, 255, 0.3)'
            : '1px solid rgba(2, 132, 199, 0.4)',
          boxShadow: '0 2px 8px rgba(11, 25, 44, 0.15)',
          color: isLight ? '#ffffff' : '#38bdf8',
        }}
      >
        <Shield size={iconSizes[size]} strokeWidth={2.2} />
        <Waves
          size={iconSizes[size] * 0.6}
          strokeWidth={2.5}
          style={{
            position: 'absolute',
            bottom: size === 'sm' ? '6px' : '8px',
            color: '#2dd4bf',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span
          style={{
            fontFamily: 'var(--font-family-display)',
            fontSize: textSizes[size],
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: isLight ? '#ffffff' : 'var(--color-navy-primary)',
          }}
        >
          CoastalGuard<span style={{ color: '#0284c7' }}>.AI</span>
        </span>
        <span
          style={{
            fontSize: size === 'sm' ? '0.65rem' : '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: isLight ? 'rgba(255, 255, 255, 0.7)' : 'var(--color-teal)',
          }}
        >
          Marine Safety Platform
        </span>
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" style={{ textDecoration: 'none' }} title="CoastalGuard AI Homepage">
        {content}
      </Link>
    );
  }

  return content;
};
