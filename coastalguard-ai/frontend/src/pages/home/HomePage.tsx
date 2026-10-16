import React from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  AlertTriangle,
  BotMessageSquare,
  Anchor,
  ShieldCheck,
  Radio,
  ArrowRight,
  Waves,
  Phone,
  Compass,
  CheckCircle2,
  Users,
  LifeBuoy
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useLanguage } from '../../i18n/LanguageContext';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      id: 'marine-weather',
      title: t('features.weatherTitle'),
      description: t('features.weatherDesc'),
      image: '/images/feature-marine-weather.jpg',
      icon: <CloudSun size={24} />,
      badge: t('features.weatherBadge'),
    },
    {
      id: 'boat-coastal',
      title: t('features.boatTitle'),
      description: t('features.boatDesc'),
      image: '/images/feature-harbour-monitoring.jpg',
      icon: <Radio size={24} />,
      badge: t('features.boatBadge'),
    },
    {
      id: 'risk-alerts',
      title: t('features.riskTitle'),
      description: t('features.riskDesc'),
      image: '/images/feature-storm-risk.jpg',
      icon: <AlertTriangle size={24} />,
      badge: t('features.riskBadge'),
    },
    {
      id: 'ai-assistant',
      title: t('features.aiTitle'),
      description: t('features.aiDesc'),
      image: '/images/feature-fisherman-safety.jpg',
      icon: <BotMessageSquare size={24} />,
      badge: t('features.aiBadge'),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* 1. Hero Section with Real Photograph Background */}
      <section className={styles.heroSection} id="hero">
        <div className={styles.heroOverlayGlow} />

        <div className={styles.heroContent}>
          {/* Badge */}
          <div className={styles.heroBadge}>
            <Waves size={16} />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className={styles.heroHeadline}>
            {t('hero.headlinePart1')}{' '}
            <span className={styles.heroHighlight}>{t('hero.headlineHighlight')}</span>
          </h1>

          {/* Supporting Text */}
          <p className={styles.heroSupportingText}>
            {t('hero.supportingText')}
          </p>

          {/* Dual Action Buttons */}
          <div className={styles.heroButtonGroup}>
            <Link
              to="/fisherman/login"
              className={styles.heroBtnFisherman}
            >
              <Anchor size={20} />
              <span>{t('hero.fishermanLogin')}</span>
            </Link>

            <Link
              to="/admin/login"
              className={styles.heroBtnAdmin}
            >
              <ShieldCheck size={20} />
              <span>{t('hero.adminLogin')}</span>
            </Link>
          </div>

          {/* Quick Metrics Banner */}
          <div className={styles.metricsStrip}>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>{t('hero.metricSectors')}</div>
              <div className={styles.metricLabel}>{t('hero.metricSectorsLabel')}</div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>{t('hero.metricTelemetry')}</div>
              <div className={styles.metricLabel}>{t('hero.metricTelemetryLabel')}</div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>{t('hero.metricBilingual')}</div>
              <div className={styles.metricLabel}>{t('hero.metricBilingualLabel')}</div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>{t('hero.metricVhf')}</div>
              <div className={styles.metricLabel}>{t('hero.metricVhfLabel')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className={styles.featureSection} id="features">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionCategory}>{t('features.category')}</span>
          <h2 className={styles.sectionTitle}>
            {t('features.title')}
          </h2>
          <p className={styles.sectionSubtitle}>
            {t('features.subtitle')}
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <div key={feature.id} className={styles.featureCard}>
              <div className={styles.cardImageWrapper}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className={styles.cardImage}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className={styles.cardImageOverlay} />
                <span className={styles.cardBadge}>{feature.badge}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardIconHeader}>
                  {feature.icon}
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className={styles.howSection} id="how-it-works">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionCategory}>{t('how.category')}</span>
          <h2 className={styles.sectionTitle}>{t('how.title')}</h2>
          <p className={styles.sectionSubtitle}>
            {t('how.subtitle')}
          </p>
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>01</div>
            <div style={{ color: 'var(--color-ocean-blue)', marginBottom: '0.5rem' }}>
              <Compass size={28} />
            </div>
            <h3 className={styles.stepTitle}>{t('how.step1Title')}</h3>
            <p className={styles.stepText}>
              {t('how.step1Text')}
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>02</div>
            <div style={{ color: 'var(--color-teal)', marginBottom: '0.5rem' }}>
              <Radio size={28} />
            </div>
            <h3 className={styles.stepTitle}>{t('how.step2Title')}</h3>
            <p className={styles.stepText}>
              {t('how.step2Text')}
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>03</div>
            <div style={{ color: 'var(--color-ocean-blue)', marginBottom: '0.5rem' }}>
              <LifeBuoy size={28} />
            </div>
            <h3 className={styles.stepTitle}>{t('how.step3Title')}</h3>
            <p className={styles.stepText}>
              {t('how.step3Text')}
            </p>
          </div>
        </div>
      </section>

      {/* 4. About Section ("Technology with a Purpose") */}
      <section className={styles.aboutSection} id="about">
        <div className={styles.aboutContainer}>
          <div>
            <span className={styles.sectionCategory}>{t('about.category')}</span>
            <h2 className={styles.aboutContentHeading}>
              {t('about.title')}
            </h2>
            <p className={styles.aboutBodyText}>
              {t('about.text')}
            </p>

            <div className={styles.aboutPillars}>
              <div className={styles.pillarItem}>
                <div className={styles.pillarIcon}>
                  <Users size={20} />
                </div>
                <div>
                  <h4 className={styles.pillarTitle}>{t('about.pillar1Title')}</h4>
                  <p className={styles.pillarDesc}>
                    {t('about.pillar1Desc')}
                  </p>
                </div>
              </div>

              <div className={styles.pillarItem}>
                <div className={styles.pillarIcon}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className={styles.pillarTitle}>{t('about.pillar2Title')}</h4>
                  <p className={styles.pillarDesc}>
                    {t('about.pillar2Desc')}
                  </p>
                </div>
              </div>

              <div className={styles.pillarItem}>
                <div className={styles.pillarIcon}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className={styles.pillarTitle}>{t('about.pillar3Title')}</h4>
                  <p className={styles.pillarDesc}>
                    {t('about.pillar3Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.aboutImageContainer}>
            <img
              src="/images/about-coastal-purpose.jpg"
              alt="Coastal patrol vessel near lighthouse"
              className={styles.aboutImage}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className={styles.aboutBadgeOverlay}>
              <ShieldCheck size={28} color="#38bdf8" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t('about.badgeTitle')}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t('about.badgeSub')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact & Assistance Section */}
      <section className={styles.contactSection} id="contact">
        <div className={styles.sectionHeader} style={{ marginBottom: 'var(--space-8)' }}>
          <span className={styles.sectionCategory}>{t('contact.category')}</span>
          <h2 className={styles.sectionTitle}>{t('contact.title')}</h2>
          <p className={styles.sectionSubtitle}>
            {t('contact.subtitle')}
          </p>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <div className={styles.contactIconCircle}>
              <Radio size={24} />
            </div>
            <h4 className={styles.contactCardTitle}>{t('contact.vhfTitle')}</h4>
            <div className={styles.contactCardValue}>{t('contact.vhfValue')}</div>
            <div className={styles.contactCardSub}>{t('contact.vhfSub')}</div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIconCircle} style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--color-teal)' }}>
              <Phone size={24} />
            </div>
            <h4 className={styles.contactCardTitle}>{t('contact.helplineTitle')}</h4>
            <div className={styles.contactCardValue} style={{ color: 'var(--color-teal)' }}>{t('contact.helplineValue')}</div>
            <div className={styles.contactCardSub}>{t('contact.helplineSub')}</div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIconCircle}>
              <ShieldCheck size={24} />
            </div>
            <h4 className={styles.contactCardTitle}>{t('contact.disasterTitle')}</h4>
            <div className={styles.contactCardValue}>{t('contact.disasterValue')}</div>
            <div className={styles.contactCardSub}>{t('contact.disasterSub')}</div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIconCircle} style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)', color: 'var(--color-teal)' }}>
              <LifeBuoy size={24} />
            </div>
            <h4 className={styles.contactCardTitle}>{t('contact.incoisTitle')}</h4>
            <div className={styles.contactCardValue} style={{ color: 'var(--color-teal)' }}>{t('contact.incoisValue')}</div>
            <div className={styles.contactCardSub}>{t('contact.incoisSub')}</div>
          </div>
        </div>
      </section>

      {/* 6. Final Call-to-Action Section */}
      <section className={styles.finalCtaSection} id="choose-portal">
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>
            {t('cta.title')}
          </h2>
          <p className={styles.ctaSupporting}>
            {t('cta.subtitle')}
          </p>

          <div className={styles.ctaButtons}>
            <Link
              to="/fisherman/login"
              className={styles.heroBtnFisherman}
            >
              <Anchor size={20} />
              <span>{t('cta.fishermanBtn')}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/admin/login"
              className={styles.heroBtnAdmin}
            >
              <ShieldCheck size={20} />
              <span>{t('cta.adminBtn')}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default HomePage;
