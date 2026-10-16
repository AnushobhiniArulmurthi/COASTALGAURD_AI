import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false, className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="radiogroup"
      aria-label="Language selection"
      className={`language-selector-widget ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '9999px',
        padding: '3px 4px',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px 0 6px',
          color: 'var(--primary-400, #38bdf8)',
        }}
        title={language === 'en' ? 'Select Language / மொழி தேர்வு' : 'மொழி தேர்வு / Select Language'}
      >
        <Languages size={15} />
      </div>

      <button
        type="button"
        role="radio"
        aria-checked={language === 'en'}
        onClick={() => setLanguage('en')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: compact ? '3px 8px' : '4px 11px',
          borderRadius: '9999px',
          fontSize: compact ? '0.75rem' : '0.8rem',
          fontWeight: language === 'en' ? 700 : 500,
          fontFamily: 'inherit',
          color: language === 'en' ? '#0f172a' : '#94a3b8',
          background: language === 'en'
            ? 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)'
            : 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: language === 'en' ? '0 1px 4px rgba(56, 189, 248, 0.4)' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        English
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={language === 'ta'}
        onClick={() => setLanguage('ta')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: compact ? '3px 8px' : '4px 11px',
          borderRadius: '9999px',
          fontSize: compact ? '0.75rem' : '0.8rem',
          fontWeight: language === 'ta' ? 700 : 500,
          fontFamily: "'Noto Sans Tamil', inherit",
          color: language === 'ta' ? '#0f172a' : '#94a3b8',
          background: language === 'ta'
            ? 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)'
            : 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: language === 'ta' ? '0 1px 4px rgba(56, 189, 248, 0.4)' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        தமிழ்
      </button>
    </div>
  );
};
