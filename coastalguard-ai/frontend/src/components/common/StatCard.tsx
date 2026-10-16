import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  trend,
  accentColor = 'var(--color-ocean-blue)',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="card-base"
      style={{
        padding: 'var(--space-5)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
      }}
    >
      {/* Subtle top indicator bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: accentColor,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-bg-alt)',
            color: accentColor,
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--color-navy-primary)',
              lineHeight: 1.1,
            }}
          >
            {value}
          </span>
          {unit && (
            <span
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
              }}
            >
              {unit}
            </span>
          )}
        </div>

        {subtitle && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              marginTop: '0.35rem',
            }}
          >
            {subtitle}
          </p>
        )}

        {trend && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: trend.isPositive ? 'var(--color-success-text)' : 'var(--color-danger-text)',
              backgroundColor: trend.isPositive ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
};
