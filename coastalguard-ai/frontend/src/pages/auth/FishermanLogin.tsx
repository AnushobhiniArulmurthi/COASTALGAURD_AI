import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff, Anchor, ArrowLeft, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import styles from './FishermanLogin.module.css';

export const FishermanLogin: React.FC = () => {
  const [identifier, setIdentifier] = useState('+91 98401 23456');
  const [password, setPassword] = useState('demo-fisherman-pass');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim()) {
      setError('Please provide your mobile number/email and safety PIN.');
      return;
    }

    setIsLoading(true);

    // Simulated prototype authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/fisherman/dashboard');
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
              <Anchor size={14} /> மீனவர் பாதுகாப்பு போர்டல்
            </span>
          </div>
          <h1 className={styles.portalTitle}>Fisherman Portal</h1>
          <p className={styles.portalSubtitle}>
            Stay informed. Stay prepared. Stay safe.
          </p>
          <p className={styles.portalSubTamil}>
            தகவல் பெறுங்கள். தயாராக இருங்கள். பாதுகாப்பாக இருங்கள்.
          </p>
        </div>

        {/* Prototype Demo Banner */}
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.85rem',
            marginBottom: 'var(--space-4)',
            fontSize: '0.8rem',
            color: '#166534',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Prototype Demo Mode:</strong> Use demo credentials to enter the Fisherman Safety cockpit.
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
            <label className={styles.label} htmlFor="fisherman-id">
              Mobile Number or Registered Email
            </label>
            <div className={styles.inputWrapper}>
              <Phone size={18} className={styles.inputIcon} />
              <input
                id="fisherman-id"
                type="text"
                className={styles.input}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+91 98400 00000 or email"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fisherman-password">
              Security PIN / Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="fisherman-password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
                style={{ accentColor: 'var(--color-teal)' }}
              />
              <span>Keep me signed in</span>
            </label>
          </div>

          <button
            type="submit"
            className={`btn btn-accent ${styles.submitBtn}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign in to Fisherman Portal</span>
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
