import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Anchor,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  MapPin,
  Ship,
  FileText,
  Globe
} from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';
import { authService } from '../../services/authService';
import styles from './FishermanRegister.module.css';

const HARBOUR_OPTIONS = [
  'Rameswaram Fishing Harbour',
  'Kasimedu Fishing Harbour (Chennai)',
  'Mandapam Coastal Jetty',
  'Kanyakumari Port Pier',
  'Nagapattinam Delta Pier',
  'Colachel Fishing Harbour',
  'Cuddalore Old Town Port',
  'Thoothukudi (Tuticorin) Fishing Harbour',
];

export const FishermanRegister: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [preferredLang, setPreferredLang] = useState<'en' | 'ta'>(language);

  // Optional Vessel Details
  const [vesselName, setVesselName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [homeHarbour, setHomeHarbour] = useState(HARBOUR_OPTIONS[0]);

  // Status State
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    // 1. Full name validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError(
        language === 'ta'
          ? 'தயவுசெய்து உங்கள் முழு பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துக்கள்).'
          : 'Please enter your full name (minimum 2 characters).'
      );
      return false;
    }

    // 2. Mobile validation (10 digits)
    const digits = mobileNumber.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) {
      setError(t('auth.invalidMobile'));
      return false;
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(t('auth.invalidEmail'));
      return false;
    }

    // 4. Password validation (minimum 8 chars)
    if (password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return false;
    }

    // 5. Confirm password matching
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.registerFisherman({
        fullName,
        mobileNumber,
        email,
        password,
        confirmPassword,
        vesselName: vesselName.trim() || undefined,
        registrationNo: registrationNo.trim() || undefined,
        homeHarbour,
        preferredLanguage: preferredLang,
      });

      setSuccessMsg(result.message || t('auth.registerSuccess'));

      // Smooth redirection to dashboard
      setTimeout(() => {
        setIsLoading(false);
        navigate('/fisherman/dashboard');
      }, 750);
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err?.message || err?.detail || 'Registration encountered an error. Please check your connection and retry.';
      setError(errMsg);
    }
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
              <Anchor size={14} /> {t('auth.fishermanBadge')}
            </span>
          </div>
          <h1 className={styles.portalTitle}>{t('auth.registerTitle')}</h1>
          <p className={styles.portalSubtitle}>{t('auth.registerSubtitle')}</p>
          {language === 'en' && (
            <p className={styles.portalSubTamil}>
              பாதுகாப்பான கடல் பயணத்திற்கான உங்கள் பதிவு
            </p>
          )}
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className={styles.successMessage}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* Full Name */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="reg-fullname">
                {t('auth.fullName')} <span className={styles.requiredStar}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.inputIcon} />
                <input
                  id="reg-fullname"
                  type="text"
                  className={styles.input}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('auth.fullNamePlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Mobile Contact Number */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="reg-mobile">
                {t('auth.mobileNumber')} <span className={styles.requiredStar}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <Phone size={18} className={styles.inputIcon} />
                <input
                  id="reg-mobile"
                  type="tel"
                  className={styles.input}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder={t('auth.mobileNumberPlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="reg-email">
                {t('auth.registerEmail')} <span className={styles.requiredStar}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  id="reg-email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.registerEmailPlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="reg-password">
                {t('auth.registerPassword')} <span className={styles.requiredStar}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.registerPasswordPlaceholder')}
                  minLength={8}
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

            {/* Confirm Password */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="reg-confirm-password">
                {t('auth.confirmPassword')} <span className={styles.requiredStar}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={styles.input}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Vessel & Craft Section Divider */}
            <div className={styles.sectionDivider}>
              <span className={styles.sectionTitle}>
                <Ship size={16} /> {t('auth.vesselSection')}
              </span>
            </div>

            {/* Vessel / Boat Name */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="reg-vessel">
                {t('auth.vesselName')}
              </label>
              <div className={styles.inputWrapper}>
                <Ship size={18} className={styles.inputIcon} />
                <input
                  id="reg-vessel"
                  type="text"
                  className={styles.input}
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  placeholder={t('auth.vesselNamePlaceholder')}
                />
              </div>
            </div>

            {/* Registration Number */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="reg-regno">
                {t('auth.registrationNo')}
              </label>
              <div className={styles.inputWrapper}>
                <FileText size={18} className={styles.inputIcon} />
                <input
                  id="reg-regno"
                  type="text"
                  className={styles.input}
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  placeholder={t('auth.registrationNoPlaceholder')}
                />
              </div>
            </div>

            {/* Base Harbour */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="reg-harbour">
                {t('auth.homeHarbour')}
              </label>
              <div className={styles.inputWrapper}>
                <MapPin size={18} className={styles.inputIcon} />
                <select
                  id="reg-harbour"
                  className={`${styles.input} ${styles.selectInput}`}
                  value={homeHarbour}
                  onChange={(e) => setHomeHarbour(e.target.value)}
                >
                  {HARBOUR_OPTIONS.map((harbour) => (
                    <option key={harbour} value={harbour}>
                      {harbour}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferred Language */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="reg-lang">
                {t('auth.preferredLanguage')}
              </label>
              <div className={styles.inputWrapper}>
                <Globe size={18} className={styles.inputIcon} />
                <select
                  id="reg-lang"
                  className={`${styles.input} ${styles.selectInput}`}
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as 'en' | 'ta')}
                >
                  <option value="en">English (Official Maritime Bulletins)</option>
                  <option value="ta">தமிழ் (தமிழ்நாடு கடலோர அறிவிப்புகள்)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security & Role Enforcement Banner */}
          <div className={styles.securityBanner}>
            <ShieldCheck size={18} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>{t('auth.roleNotice')}</strong>
              <div style={{ marginTop: '2px', opacity: 0.9 }}>
                {t('auth.backendStoreNotice')}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-ocean ${styles.submitBtn}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>{t('auth.registering')}</span>
            ) : (
              <>
                <span>{t('auth.registerBtn')}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation with Log In Link */}
        <div className={styles.footerLinks}>
          <div>
            <span style={{ color: 'var(--color-text-secondary)', marginRight: '0.4rem' }}>
              {t('auth.alreadyHaveAccount')}
            </span>
            <Link to="/fisherman/login" className={styles.link}>
              {t('auth.logIn')}
            </Link>
          </div>

          <Link to="/" className={styles.backHome}>
            <ArrowLeft size={16} />
            <span>{t('auth.backHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FishermanRegister;
