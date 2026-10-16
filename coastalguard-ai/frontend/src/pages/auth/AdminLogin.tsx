import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import styles from './AdminLogin.module.css';

export const AdminLogin: React.FC = () => {
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
      setError('Please provide both administrative email and security passphrase.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid official email address.');
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
        {/* Header Branding */}
        <div className={styles.headerContainer}>
          <Logo size="md" />
          <div>
            <span className={styles.badgeTag}>
              <ShieldCheck size={14} /> Official Command Access
            </span>
          </div>
          <h1 className={styles.portalTitle}>Admin Portal</h1>
          <p className={styles.portalSubtitle}>
            Monitor marine conditions and manage safety alerts.
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
            <strong>Prototype Demo Mode:</strong> Any sample credentials will grant access to the command dashboard for review.
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
              Command Email
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
              Security Passphrase
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              <span>Remember this console</span>
            </label>
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign in to Admin Console</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className={styles.footerLinks} style={{ justifyContent: 'center' }}>
          <Link to="/" className={styles.backHome}>
            <ArrowLeft size={16} />
            <span>Back to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
