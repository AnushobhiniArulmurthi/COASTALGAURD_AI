import React from 'react';
import { Layers } from 'lucide-react';

interface PlaceholderPanelProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  height?: string | number;
  children?: React.ReactNode;
}

export const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({
  title,
  description,
  icon = <Layers size={32} />,
  height = '240px',
  children,
}) => {
  return (
    <div
      className="card-base"
      style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: height,
        borderStyle: 'dashed',
        borderWidth: '2px',
        borderColor: 'var(--color-border-subtle)',
        backgroundColor: '#fafcff',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-ocean-soft)',
          color: 'var(--color-ocean-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-3)',
        }}
      >
        {icon}
      </div>

      <h4
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--color-navy-primary)',
          marginBottom: '0.35rem',
        }}
      >
        {title}
      </h4>

      {description && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '450px',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}

      {children && (
        <div style={{ marginTop: 'var(--space-4)', width: '100%' }}>
          {children}
        </div>
      )}
    </div>
  );
};
