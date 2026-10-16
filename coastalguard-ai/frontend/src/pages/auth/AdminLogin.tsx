import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';
import styles from './AdminLogin.module.css';

export const AdminLogin: React.FC = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('admin@coastalguard.gov.in');
  const [password, setPassword] = useState('demo-coastguard-pass');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError(t('auth.errorRequired'));
      return;
    }

    if (!email.includes('@')) {
      setError(t('auth.errorEmail'));
      return;
    }

    setIsLoading(true);

    // Simulated prototype authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin/dashboard');
    }, 400);
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        {/* Top-Right Language Switcher */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-2)' }}>
          <LanguageSelector compact />
        </div>

        {/* Header Branding */}
        <div className={styles.headerContainer}>
          <Logo size="md" />
          <div>
            <span className={styles.badgeTag}>
              <ShieldCheck size={14} /> {t('auth.officialBadge')}
            </span>
          </div>
          <h1 className={styles.portalTitle}>{t('auth.adminTitle')}</h1>
          <p className={styles.portalSubtitle}>
            {t('auth.adminSubtitle')}
          </p>
        </div>

        {/* Prototype Demo Banner */}
        <div
          style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.85rem',
            marginBottom: 'var(--space-4)',
            fontSize: '0.8rem',
            color: '#0369a1',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>{language === 'ta' ? 'மாதிரி செயல்முறை:' : 'Prototype Demo Mode:'}</strong>{' '}
            {t('auth.demoNotice')}
          </span>
        </div>

        {/* Error notification */}
        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="admin-email">
              {t('auth.email')}
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="admin-email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@coastalguard.gov.in"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="admin-password">
              {t('auth.password')}
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--color-navy-primary)' }}
              />
              <span>{t('auth.rememberMe')}</span>
            </label>
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>{t('auth.authenticating')}</span>
            ) : (
              <>
                <span>{t('auth.signInAdmin')}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className={styles.footerLinks} style={{ justifyContent: 'center' }}>
          <Link to="/" className={styles.backHome}>
            <ArrowLeft size={16} />
            <span>{t('auth.backHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;
