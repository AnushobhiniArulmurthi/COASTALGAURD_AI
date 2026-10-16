import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
}) => {
  const { t } = useLanguage();
  const displayBadge = badge !== undefined ? badge : t('common.prototypeBadge');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        paddingBottom: 'var(--space-4)',
        borderBottom: '1px solid var(--color-border-light)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--color-navy-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          {displayBadge && (
            <span className="badge-prototype">
              <Sparkles size={11} />
              {displayBadge}
            </span>
          )}
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '720px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {action}
        </div>
      )}
    </div>
  );
};
