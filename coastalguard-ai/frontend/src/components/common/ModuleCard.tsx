import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  badge?: string;
  actionText?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  linkTo,
  badge,
  actionText = 'Open Module',
}) => {
  return (
    <div
      className="card-base"
      style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        gap: 'var(--space-4)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-ocean-soft)',
              color: 'var(--color-ocean-blue)',
            }}
          >
            {icon}
          </div>

          {badge && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-bg-alt)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--color-navy-primary)',
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </div>

      <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-light)' }}>
        <Link
          to={linkTo}
          className="btn btn-outline"
          style={{
            width: '100%',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
          }}
        >
          <span>{actionText}</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
