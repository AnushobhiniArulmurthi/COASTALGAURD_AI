import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Radio, ShieldAlert } from 'lucide-react';
import type { SeverityLevel, BoatStatus, UserStatus } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

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
  const { language } = useLanguage();
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
      label = language === 'ta' ? 'குறைவு' : 'Low Risk';
      IconComponent = CheckCircle;
      break;
    case 'moderate':
      bg = 'var(--color-warning-bg)';
      color = 'var(--color-warning-text)';
      border = 'var(--color-warning-border)';
      label = language === 'ta' ? 'மிதமானது' : 'Moderate Caution';
      IconComponent = AlertTriangle;
      break;
    case 'high':
      bg = 'var(--color-danger-bg)';
      color = 'var(--color-danger-text)';
      border = 'var(--color-danger-border)';
      label = language === 'ta' ? 'அதிகம்' : 'High Danger';
      IconComponent = AlertCircle;
      break;
    case 'extreme':
      bg = 'var(--color-extreme-bg)';
      color = 'var(--color-extreme-text)';
      border = 'var(--color-extreme-border)';
      label = language === 'ta' ? 'மிக அதிகம்' : 'Extreme Danger';
      IconComponent = ShieldAlert;
      break;
    case 'sample':
      bg = 'var(--color-success-bg)';
      color = 'var(--color-success-text)';
      border = 'var(--color-success-border)';
      label = language === 'ta' ? 'இணைக்கப்பட்டது' : 'Sample Synced';
      IconComponent = CheckCircle;
      break;
    case 'active':
      bg = 'var(--color-success-bg)';
      color = 'var(--color-success-text)';
      border = 'var(--color-success-border)';
      label = language === 'ta' ? 'செயலில்' : 'Active';
      IconComponent = CheckCircle;
      break;
    case 'open':
      bg = 'var(--color-success-bg)';
      color = 'var(--color-success-text)';
      border = 'var(--color-success-border)';
      label = language === 'ta' ? 'திறந்துள்ளது' : 'Open';
      IconComponent = CheckCircle;
      break;
    case 'strong':
      bg = 'var(--color-success-bg)';
      color = 'var(--color-success-text)';
      border = 'var(--color-success-border)';
      label = language === 'ta' ? 'வலுவானது' : 'Strong';
      IconComponent = CheckCircle;
      break;
    case 'stale':
      bg = 'var(--color-warning-bg)';
      color = 'var(--color-warning-text)';
      border = 'var(--color-warning-border)';
      label = language === 'ta' ? 'பழைய சிக்னல்' : 'Stale Signal';
      IconComponent = Radio;
      break;
    case 'caution':
      bg = 'var(--color-warning-bg)';
      color = 'var(--color-warning-text)';
      border = 'var(--color-warning-border)';
      label = language === 'ta' ? 'எச்சரிக்கை' : 'Caution';
      IconComponent = AlertTriangle;
      break;
    case 'degraded':
      bg = 'var(--color-warning-bg)';
      color = 'var(--color-warning-text)';
      border = 'var(--color-warning-border)';
      label = language === 'ta' ? 'பலவீனமானது' : 'Degraded';
      IconComponent = Radio;
      break;
    case 'unknown':
      bg = 'var(--color-danger-bg)';
      color = 'var(--color-danger-text)';
      border = 'var(--color-danger-border)';
      label = language === 'ta' ? 'தெரியவில்லை' : 'Unknown Beacon';
      IconComponent = AlertTriangle;
      break;
    case 'inactive':
    case 'suspended':
      bg = 'var(--color-danger-bg)';
      color = 'var(--color-danger-text)';
      border = 'var(--color-danger-border)';
      label = language === 'ta' ? 'செயலற்றது' : 'Inactive';
      IconComponent = AlertTriangle;
      break;
    case 'closed to entry':
      bg = 'var(--color-danger-bg)';
      color = 'var(--color-danger-text)';
      border = 'var(--color-danger-border)';
      label = language === 'ta' ? 'நுழைவு தடை' : 'Closed to Entry';
      IconComponent = AlertTriangle;
      break;
    case 'offline':
      bg = 'var(--color-danger-bg)';
      color = 'var(--color-danger-text)';
      border = 'var(--color-danger-border)';
      label = language === 'ta' ? 'ஆஃப்லைன்' : 'Offline';
      IconComponent = AlertTriangle;
      break;
    default:
      label = String(status);
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
        fontWeight: 700,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {showIcon && <IconComponent size={isSmall ? 13 : 15} strokeWidth={2.5} />}
      <span>{label}</span>
    </span>
  );
};
