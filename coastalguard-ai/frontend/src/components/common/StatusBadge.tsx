import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Radio, ShieldAlert } from 'lucide-react';
import type { SeverityLevel, BoatStatus, UserStatus } from '../../types';

type BadgeType = SeverityLevel | BoatStatus | UserStatus | 'Open' | 'Caution' | 'Closed to Entry' | 'Strong' | 'Degraded' | 'Offline';

interface StatusBadgeProps {
  status: BadgeType;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  size = 'md',
}) => {
  const normalized = String(status).toLowerCase();

  let bg = '#f1f5f9';
  let color = '#475569';
  let border = '#cbd5e1';
  let label = String(status);
  let IconComponent: React.ComponentType<{ size: number; strokeWidth?: number }> = Info;

  switch (normalized) {
    case 'low':
      bg = 'var(--color-success-bg)';
      color = 'var(--color-success-text)';
      border = 'var(--color-success-border)';
      label = 'Low Risk';
      IconComponent = CheckCircle;
      break;
    case 'moderate':
      bg = 'var(--color-warning-bg)';
      color = 'var(--color-warning-text)';
      border = 'var(--color-warning-border)';
      label = 'Moderate Caution';
      IconComponent = AlertTriangle;
      break;
    case 'high':
      bg = 'var(--color-danger-bg)';
      color = 'var(--color-danger-text)';
      border = 'var(--color-danger-border)';
      label = 'High Danger';
      IconComponent = AlertCircle;
      break;
    case 'extreme':
      bg = 'var(--color-extreme-bg)';
      color = 'var(--color-extreme-text)';
      border = 'var(--color-extreme-border)';
      label = 'Extreme Danger';
      IconComponent = ShieldAlert;
      break;
    case 'sample':
    case 'active':
    case 'open':
    case 'strong':
      bg = 'var(--color-success-bg)';
      color = 'var(--color-success-text)';
      border = 'var(--color-success-border)';
      label = status === 'sample' ? 'Sample Synced' : status;
      IconComponent = CheckCircle;
      break;
    case 'stale':
    case 'caution':
    case 'degraded':
      bg = 'var(--color-warning-bg)';
      color = 'var(--color-warning-text)';
      border = 'var(--color-warning-border)';
      label = status === 'stale' ? 'Stale Signal' : status;
      IconComponent = Radio;
      break;
    case 'unknown':
    case 'inactive':
    case 'suspended':
    case 'closed to entry':
    case 'offline':
      bg = 'var(--color-danger-bg)';
      color = 'var(--color-danger-text)';
      border = 'var(--color-danger-border)';
      label = status === 'unknown' ? 'Unknown Beacon' : status;
      IconComponent = AlertTriangle;
      break;
  }

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '0.25rem' : '0.4rem',
        padding: isSmall ? '0.15rem 0.5rem' : '0.25rem 0.75rem',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-full)',
        fontSize: isSmall ? '0.75rem' : '0.8125rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
      }}
    >
      {showIcon && <IconComponent size={isSmall ? 12 : 14} strokeWidth={2.4} />}
      <span>{label}</span>
    </span>
  );
};
